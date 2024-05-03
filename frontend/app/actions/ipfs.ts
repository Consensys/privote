"use server";

type AddOptions =
  | {
      blob: Blob;
      fileName: string;
    }
  | {
      files: File[];
    }
  | {
      file: File;
    };

export const add = async (data: string) => {
  let baseUrl = `${process.env.INFURA_IPFS_ENDPOINT}/api/v0/add`;
  let hash: string;
  const formData = new FormData();
  formData.append("data", data);

  //   if ("blob" in data) {
  //     formData.append("data", data.blob, data.fileName);
  //   }

  //   if ("files" in data) {
  //     const { files } = data;
  //     files.forEach((file) => {
  //       formData.append("files", file);
  //     });
  //     baseUrl += "?wrap-with-directory=true";
  //   }

  //   if ("file" in data) {
  //     const { file } = data;
  //     formData.append("file", file);
  //   }

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.INFURA_IPFS_KEY + ":" + process.env.INFURA_IPFS_SECRET
          ).toString("base64"),
      },
      body: formData,
    });

    return (await response.json()).Hash;
  } catch (error) {
    console.error("Error adding file", error);
  }
};

export const cat = async (hash: string) => {
  const response = await fetch(
    `${process.env.INFURA_IPFS_ENDPOINT}/api/v0/cat?arg=${hash}`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.INFURA_IPFS_KEY + ":" + process.env.INFURA_IPFS_SECRET
          ).toString("base64"),
      },
    }
  );

  return await response.json();
};

export const getDirectoryContent = async (hash: string): Promise<string[]> => {
  try {
    const dirResponse = await fetch(`https://dweb.link/api/v0/ls?arg=${hash}`);

    const directory = await dirResponse.json();

    return directory.Objects[0].Links.map((sc: any) => sc.Hash);
  } catch (error) {
    console.error("Error getting directory content", error);
    return [];
  }
};
