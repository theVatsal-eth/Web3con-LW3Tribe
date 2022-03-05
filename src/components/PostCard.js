import React from "react";
import { Contract, providers } from "ethers";
import { DC_CONTRACT_ADDRESS, DC_CONTRACT_ABI } from "../constants";
import { useState, useEffect } from "react";

import axios from 'axios'

export default function PostCard() {
  const [posts, setPosts] = useState([]);
  const[postResults,setPostResults] = useState([]);
  
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchAllPosts();
  }, []);

  const results = [];



  const fetchAllPosts = async () => {
    const provider = new providers.Web3Provider(window.ethereum);
    const DCContract = new Contract(
      DC_CONTRACT_ADDRESS,
      DC_CONTRACT_ABI,
      provider
    );
    const posts = await DCContract.allPosts();
    console.log(posts);
    setPosts(posts);
    fetchDataFromIPFS(posts[7].metadateURL);
  };


  const ipfsMetadataUrlToHttpUrl = (ipfsUrl) => {
    const url = ipfsUrl.replace('ipfs://', 'https://');
    const metadataURL = url.replace('/metadata.json', '.ipfs.dweb.link/metadata.json');
    return metadataURL;

  }

  const ipfsImageUrlToHttpUrl = (imageUrl) => {
    var urlArray = imageUrl.split("/");
    urlArray[urlArray.length - 1] = ".ipfs.dweb.link/" + urlArray[urlArray.length - 1];
    var finalUrl = "https:" + "//" + urlArray[2] + urlArray[3];
    return finalUrl;
  }


  const fetchDataFromIPFS = async (_postMetadataURL) => {
    try {
      console.log('_postMetadataURL', _postMetadataURL)
      const metadataURL = ipfsMetadataUrlToHttpUrl(_postMetadataURL);
      const response = await fetch(metadataURL);
      const data = await response.json();
      const imageURl = ipfsImageUrlToHttpUrl(data.image);

      console.log("Metadata", metadataURL);
      console.log("IMAGE_URL", imageURl);

    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const boxStyle = {
    border: "1px solid white",
    borderRadius: "5px",
    padding: "1rem",
    marginTop: "5rem",
    backgroundColor: "rgba(0,0,0,0.5)",
  };

  return <div style={boxStyle}>
    PostCard
  </div>;
}
