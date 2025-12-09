export {};

interface SnapPayOptions {
  // embedId: string;
  onSuccess?: (result: any) => void;
  onPending?: (result: any) => void;
  onError?: (result: any) => void;
}

declare global {
  interface Window {
    snap: {
      hide: () => void;
      show: () => void;
      pay: (token: string, options: SnapPayOptions) => void;
    };
  }
}
