import {
    packPoint,
    unpackPoint,
    mulPointEscalar,
    Point,
    addPoint,
  } from "@zk-kit/baby-jubjub";

const tallyResults = (encryptedVotes: string[], privateKey: number) => {
    // const decryptedVotes = encryptedVotes.map(ciphertext => {
    //     // Multiply the ciphertext point by the private key to get the plaintext point.
    //     const plaintextPoint = mulPointEscalar(ciphertext, privateKey);

    //     // Convert the plaintext point back to a message.
    //     const message = pointToMessage(plaintextPoint);

    //     return message;
    // });

    // return decryptedVotes;
}