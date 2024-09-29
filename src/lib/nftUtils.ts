// Remove the dotenv require statement
// const apiKey = process.env.HELIUS_API_KEY;
const url = `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`;

interface Group {
  group_key: string;
  group_value: string;
}

interface Asset {
  id: string;
  content: any;
  grouping: Group[];
}

interface ApiResponse {
  result: {
    items: Asset[];
    nativeBalance: number;
  };
}

export const getAssetsByCollectionAddress = async (address: string) => {
  if (!process.env.NEXT_PUBLIC_HELIUS_API_KEY) {
    throw new Error('HELIUS_API_KEY is not set in environment variables');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAssetsByOwner',
      params: {
        ownerAddress: address,
        displayOptions: {
          showFungible: true,
          showNativeBalance: true,
        },
      },
    }),
  });

  const { result } = (await response.json()) as ApiResponse;
  
  const collectionAddresses = [
    'DtJXwtEDbzhRvAfETjHtNyopS275QyvKS2RGBUc1hY4y',
    'SPpCU2d2wE8nA51EqPDzUQZqDDEAP2bGJzzbLio4Pcn',
    'Fvpn3WGqT8n5bgYuHdSr5xLS6V6GtYDS2w5jjhhS5s8z'
  ];
  
  const filteredAssets = result.items.filter((item: Asset) => 
    item.grouping && 
    item.grouping.some(group => 
      group.group_key === 'collection' && 
      collectionAddresses.includes(group.group_value)
    )
  );

  return {
    nftCount: filteredAssets.length
  };
};