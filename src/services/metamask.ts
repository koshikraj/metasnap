import {SnapRpcMethodRequest} from "@safient/snap-types";
import {enableFilecoinSnap, MetamaskSafientSnap, isSnapInstalled} from "@safient/wallet-adapter";

declare global {
    interface Window {
        ethereumi: {
            isMetaMask: boolean;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            send: <T>(request: SnapRpcMethodRequest | {method: string; params?: any[]}) => Promise<T>;
            on: (eventName: unknown, callback: unknown) => unknown;
            // requestIndex: () => Promise<{getSnapApi: (origin: string) => Promise<FilecoinApi>}>;
        }
    }
}

export const defaultSnapId = 'local:http://localhost:8081';

let isInstalled: boolean = false;

export interface SnapInitializationResponse {
    isSnapInstalled: boolean;
    snap?: MetamaskSafientSnap;
}

export async function initiateFilecoinSnap(): Promise<SnapInitializationResponse> {

    const snapId = process.env.REACT_APP_SNAP_ID ? process.env.REACT_APP_SNAP_ID : defaultSnapId
    try {
        console.log('Attempting to connect to snap...');
        
        const metamaskSafientSnap = await enableFilecoinSnap({network: "f"}, snapId, {version: "latest"});

        isInstalled = true;
        return {isSnapInstalled: true, snap: metamaskSafientSnap};
    } catch (e) {
        console.error(e);
        isInstalled = false;
        return {isSnapInstalled: false};
    }
}

export async function isFilecoinSnapInstalled(): Promise<boolean> {
    const snapId = process.env.REACT_APP_SNAP_ID ? process.env.REACT_APP_SNAP_ID : defaultSnapId
    return isSnapInstalled(snapId);
}
