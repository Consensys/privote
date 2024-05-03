'use client';

import * as React from "react";
import { Minus, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import createMerkleTreeManager from "@/app/actions/merkle-tree";
import Tree from "react-d3-tree";
import AddNewVoter from "./add-new-voter";
import { getPrivoteById } from "@/app/actions/privia";

//import "./tree-viewer.css";

type TreeNode = {
  name: string;
  children: TreeNode[];
};

const convertLayersToTreeData = (layers: Buffer[][]): TreeNode[] => {
  if (!layers.length) return [];

  const root: TreeNode = {
    name: shortenHash(layers[layers.length - 1][0].toString("hex")),
    children: [],
  };
  let nodes: TreeNode[] = [root];

  for (let i = layers.length - 2; i >= 0; i--) {
    const newNodes: TreeNode[] = [];

    for (let j = 0; j < layers[i].length; j++) {
      const node: TreeNode = {
        name: shortenHash(layers[i][j].toString("hex")),
        children: [],
      };

      if (j % 2 === 0) {
        nodes[Math.floor(j / 2)].children.push(node);
      } else {
        nodes[Math.floor(j / 2)].children.unshift(node);
      }

      newNodes.push(node);
    }

    nodes = newNodes;
  }

  return [root];
};

function shortenHash(hash: string): string {
  return hash.slice(0, 6) + "..." + hash.slice(-6);
}

const TreeViewer = ({ ballotId }) => {
  const [d3Tree, setd3Tree] = React.useState<TreeNode[]>([]);
  const [reFetch, setReFetch] = React.useState<boolean>(false);

  // const calculateTree = async () => {
  //   const vote = await getPriviaById(ballotId);

  //   if (!vote) return;
  //   const tree = createMerkleTreeManager(
  //     Math.ceil(Math.log2(vote.voters.length)),
  //     vote.voters
  //   );

  //   const layers = tree.tree.getLayers();
  //   setd3Tree(convertLayersToTreeData(layers));
  // };

  // React.useEffect(() => {
  //   calculateTree();
  //   if(reFetch) {
  //     calculateTree();
  //   }
  //   setReFetch(false)
  // }, [reFetch]);


  // const handleAddNewVoter = async (address: string) => {
  //   console.log("submitting", ballotId);
  //   await addNewVoter(ballotId, address);
  //   setReFetch(true);
  // };

  return (
  
        <div className="mx-auto h-[60vh] w-full">

            <div>
              <h2>Voters Tree</h2>
              <h3>This is the tree of voters</h3>
            </div>
            
            <div className="flex gap-2 items-center">
              {/* <AddNewVoter ballotId={ballotId} handleSubmit={handleAddNewVoter}/>
       */}
            </div>

          <div className="w-full bg-white h-full">
            {
              d3Tree && d3Tree.length && (
                <Tree
                  data={d3Tree}
                  pathClassFunc={() => "custom__links"}
                  rootNodeClassName="node__root"
                  branchNodeClassName="node__branch"
                  leafNodeClassName="node__leaf"
                />

              )
            }
          </div>
        </div>
  );
};

export default TreeViewer;
