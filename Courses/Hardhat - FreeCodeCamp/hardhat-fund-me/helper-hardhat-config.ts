
export interface networkConfigItem {
    ethUsdPriceFeed?: string;
    blockConfirmations?: number;
}

export interface networkConfigInfo {
    [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
    4: {
        ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
        blockConfirmations: 6
    },
};

export const developmentChains = [31337];

export const DECIMALS = 8;
export const INITIAL_ANSWER = 200000000000;