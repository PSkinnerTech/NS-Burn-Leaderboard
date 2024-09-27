import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata, fetchDigitalAsset, fetchDigitalAssetWithTokenByMint } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import { Connection, PublicKey } from "@solana/web3.js";

const QUICKNODE_RPC = "https://nameless-misty-paper.solana-mainnet.quiknode.pro/1f697ad1cc0b0c550141ed27bb0d35c4074f7057/";

// Create a UMI instance with the QuickNode RPC endpoint
const umi = createUmi(QUICKNODE_RPC);

// Use the mplTokenMetadata plugin
umi.use(mplTokenMetadata());

// Create a Solana connection using the QuickNode RPC
const connection = new Connection(QUICKNODE_RPC);

// Network School Cryptocredentials collection address
const NS_COLLECTION_ADDRESS = "5b4ZfyhVEuHEiUWzoWPrQqvhWD3WLyktPpQm2xs2CnyJ";

export async function getSlot() {
  try {
    const slot = await connection.getSlot();
    console.log("Current slot:", slot);
    return slot;
  } catch (error) {
    console.error("Error fetching slot:", error);
    throw error;
  }
}

export async function fetchAndLogNFTMetadata(mintAddressString: string) {
  try {
    console.log(`Fetching NFT metadata for mint address: ${mintAddressString}`);
    
    const mintAddress = publicKey(mintAddressString);
    const asset = await fetchDigitalAsset(umi, mintAddress);

    console.log("NFT Metadata:");
    console.log("Name:", asset.metadata.name);
    console.log("Symbol:", asset.metadata.symbol);
    console.log("URI:", asset.metadata.uri);

    if (asset.metadata.uri) {
      const response = await fetch(asset.metadata.uri);
      const jsonMetadata = await response.json();
      console.log("\nJSON Metadata:");
      console.log(JSON.stringify(jsonMetadata, null, 2));
    }

    return asset;
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    throw error;
  }
}

export async function getNFTsForOwner(ownerAddress: string) {
  try {
    const ownerPublicKey = new PublicKey(ownerAddress);
    const nftMetadata = await connection.getParsedTokenAccountsByOwner(ownerPublicKey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    });

    const nfts = nftMetadata.value.filter(accountInfo => 
      accountInfo.account.data.parsed.info.tokenAmount.uiAmount === 1 &&
      accountInfo.account.data.parsed.info.tokenAmount.decimals === 0
    );

    return nfts;
  } catch (error) {
    console.error("Error fetching NFTs for owner:", error);
    throw error;
  }
}

export async function countNSNFTs(walletAddress: string) {
  try {
    const nfts = await getNFTsForOwner(walletAddress);
    let nsNftCount = 0;

    for (const nft of nfts) {
      const mintAddress = nft.account.data.parsed.info.mint;
      const asset = await fetchDigitalAssetWithTokenByMint(umi, publicKey(mintAddress));
      
      if (asset.metadata.collection?.key === NS_COLLECTION_ADDRESS) {
        nsNftCount++;
      }
    }

    console.log(`Found ${nsNftCount} Network School Cryptocredentials NFTs in wallet ${walletAddress}`);
    return nsNftCount;
  } catch (error) {
    console.error("Error counting NS NFTs:", error);
    throw error;
  }
}