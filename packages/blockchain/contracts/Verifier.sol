// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
pragma solidity ^0.8.0;
library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }
    /// @return the generator of G1
    function P1() pure internal returns (G1Point memory) {
        return G1Point(1, 2);
    }
    /// @return the generator of G2
    function P2() pure internal returns (G2Point memory) {
        return G2Point(
            [10857046999023057135944570762232829481370756359578518086990519993285655852781,
             11559732032986387107991004021392285783925812861821192530917403151452391805634],
            [8495653923123431417604973247489272438418190587263600148770280649306958101930,
             4082367875863433681332203403145435568316851327593401208105741076214120093531]
        );
    }
    /// @return the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(G1Point memory p) pure internal returns (G1Point memory) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0)
            return G1Point(0, 0);
        return G1Point(p.X, q - (p.Y % q));
    }
    /// @return r the sum of two points of G1
    function addition(G1Point memory p1, G1Point memory p2) internal view returns (G1Point memory r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
    }


    /// @return r the product of a point on G1 and a scalar, i.e.
    /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
    function scalar_mul(G1Point memory p, uint s) internal view returns (G1Point memory r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require (success);
    }
    /// @return the result of computing the pairing check
    /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
    /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should
    /// return true.
    function pairing(G1Point[] memory p1, G2Point[] memory p2) internal view returns (bool) {
        require(p1.length == p2.length);
        uint elements = p1.length;
        uint inputSize = elements * 6;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < elements; i++)
        {
            input[i * 6 + 0] = p1[i].X;
            input[i * 6 + 1] = p1[i].Y;
            input[i * 6 + 2] = p2[i].X[1];
            input[i * 6 + 3] = p2[i].X[0];
            input[i * 6 + 4] = p2[i].Y[1];
            input[i * 6 + 5] = p2[i].Y[0];
        }
        uint[1] memory out;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 8, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
        return out[0] != 0;
    }
    /// Convenience method for a pairing check for two pairs.
    function pairingProd2(G1Point memory a1, G2Point memory a2, G1Point memory b1, G2Point memory b2) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](2);
        G2Point[] memory p2 = new G2Point[](2);
        p1[0] = a1;
        p1[1] = b1;
        p2[0] = a2;
        p2[1] = b2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for three pairs.
    function pairingProd3(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](3);
        G2Point[] memory p2 = new G2Point[](3);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for four pairs.
    function pairingProd4(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2,
            G1Point memory d1, G2Point memory d2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](4);
        G2Point[] memory p2 = new G2Point[](4);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p1[3] = d1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        p2[3] = d2;
        return pairing(p1, p2);
    }
}

contract Verifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G1Point alpha;
        Pairing.G2Point beta;
        Pairing.G2Point gamma;
        Pairing.G2Point delta;
        Pairing.G1Point[] gamma_abc;
    }
    struct Proof {
        Pairing.G1Point a;
        Pairing.G2Point b;
        Pairing.G1Point c;
    }
    function verifyingKey() pure internal returns (VerifyingKey memory vk) {
        vk.alpha = Pairing.G1Point(uint256(0x194b94d2b9feb9b29c7c181e84f240bebf42c61436b1936a5e3a222b52b08079), uint256(0x048af27d31f432d0528a4f63e9b0b8959afe374df77d191b23d5d8614fae24c5));
        vk.beta = Pairing.G2Point([uint256(0x11988ef1324472f79d3872ce80746b27a522fe881f27253f029348fbde883022), uint256(0x263d948fb01af12d9b388d56bb9278b0803d6d90dec7f5ea82b2bb0caf497101)], [uint256(0x22483715391439abcf0a3375dc4755f783987c3364b6d17478fc546724c2f12f), uint256(0x0dcf351fd589fd591ca388071140f0d0d2deba2f8f8a833b8fb1d605a2d3ffe0)]);
        vk.gamma = Pairing.G2Point([uint256(0x1b41cc199eb97ccd636fbd3b668f09a3633f265a36a5cebdae4b59fdc85bfa26), uint256(0x30055ff4499a6470d611463ce384bd21f32f62ddbecaf33e4470dc2c34d0bc00)], [uint256(0x19294f3070fbaff3148c8039ab055dc602e8a9a07745d829b7312a8e876c1aa5), uint256(0x297635b64a7fd9c1e23e1078d2b21f36fe3aebebf9e34161bf0be952bebca57c)]);
        vk.delta = Pairing.G2Point([uint256(0x1d895089de41dad53c74cff9c5a550f8ee958a36916283507ec527ec97ef1076), uint256(0x0a1eebb7e860443443ac9e2b78ed3c50a20343f1233d26f33978d1730f7c06ce)], [uint256(0x03a937a83d63ebea27112cf58928864f2631ce58f60836106844f26c7994dbb7), uint256(0x1b26c8b9222c5e908e5b7eb0d852e703d9bb16d4a9fd0b2d248f7d2e49fb6d71)]);
        vk.gamma_abc = new Pairing.G1Point[](13);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x1d0926af0419a0bad717892d800a821a82f378793a6149b33359a2e17b22ee3a), uint256(0x01b1e8611dbc9ec4117f1a3f1684c3c2e3b725e95f6d626a3485e0a5224eb0ba));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x0e9c2dae3ba2e31f9d52a4228e63f47b6ff8875fe658636eb336e89375651bb4), uint256(0x166e639cc0277b3923fa94540b71685298e24715a44bcaafcf04baa5ec00da60));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x267854e499b890a23b4d4ea766070d7941cf1453a23e6791ccf914569b1fc22e), uint256(0x248b136cf28f758124dc4962a3af05f65207faad1e7545e450c4ea4e7b1dc944));
        vk.gamma_abc[3] = Pairing.G1Point(uint256(0x1109f28cdb98ce71c97091fa05787907ff5890a12211c858ab196c7b18aa1fad), uint256(0x2399c4155f9a3df636c5c82d71b4e37d6e45c9627f2ebfb17121cea1bafd6a20));
        vk.gamma_abc[4] = Pairing.G1Point(uint256(0x2e7cf2011b6896e84ec5c93f004c14a6e9a022bb297131d00ad29c2932419d94), uint256(0x19879acd2d0d89a93de149ec3e4027e69cc736abc96cedfc941675fb47953094));
        vk.gamma_abc[5] = Pairing.G1Point(uint256(0x150c5995c7f2e22775a56ed867eb873b1c08c7d0e6e3c71a2e501311da60de83), uint256(0x2cc7e20f8c9fcf00a7b265d2c1594050ef113706c4c4e03e79608d6a9aed8999));
        vk.gamma_abc[6] = Pairing.G1Point(uint256(0x08f5acabc31bd254fe4f75d2cc7c95ed69aefc13ae89d41b1002515dc948c3a9), uint256(0x06591e1cc8e33121e523c1739a93c8cb1039ff1e3f7fbd5d8093b16f71bb54cf));
        vk.gamma_abc[7] = Pairing.G1Point(uint256(0x06e900d0b437bc6d1e4dc29788c075bd241ebc1f2209a42f4cbef62c737a7bc1), uint256(0x1a44e3fe45c5d1981c09ea92c219c4190ab2524a7f6659cbef4d05bdc700354f));
        vk.gamma_abc[8] = Pairing.G1Point(uint256(0x06ade40eb2106de11798f6f93388e434e385ef00471ae4a52b1fe1a38f15f114), uint256(0x20d9edc17a5c6c3f405944653faeab1b1df2c2ad2cc1bc902a6d3d5936849a9c));
        vk.gamma_abc[9] = Pairing.G1Point(uint256(0x13588e60012f5d8426e65d2b480956be79e3ee89fef628bbebca9deba4876884), uint256(0x2532722063c9a340e52a7b8b3d4436126287948dae37c6d3a3b59d2012c28577));
        vk.gamma_abc[10] = Pairing.G1Point(uint256(0x299b39ceddedcdae6f177a0fcdb9b6310745af0de9610aa331c7b5b4737bc2ff), uint256(0x0bc78e0584e3638b4e827faca22a934a551bd59b0ccd1f49159f9aed65639dec));
        vk.gamma_abc[11] = Pairing.G1Point(uint256(0x2f27b647febcfd042e6739f3e1410630216ab8eb78480e3eb46217bd897352ab), uint256(0x05a8c9771bff6e6c1c0cafe30e212a181ef97f951a39fd9d3c1f66daac1586df));
        vk.gamma_abc[12] = Pairing.G1Point(uint256(0x03c29251d8589fe09f8f28613580c13a82c604aeba3aee2e3ff947b7377427be), uint256(0x23db3c24333a321a053b7a63744c51fe98a2723c67bf8f6d15afb3ca7c2103f3));
    }
    function verify(uint[] memory input, Proof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.gamma_abc.length);
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field);
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.gamma_abc[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.gamma_abc[0]);
        if(!Pairing.pairingProd4(
             proof.a, proof.b,
             Pairing.negate(vk_x), vk.gamma,
             Pairing.negate(proof.c), vk.delta,
             Pairing.negate(vk.alpha), vk.beta)) return 1;
        return 0;
    }
    function verifyTx(
            Proof memory proof, uint[12] memory input
        ) public view returns (bool r) {
        uint[] memory inputValues = new uint[](12);
        
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            return true;
        } else {
            return false;
        }
    }
}
