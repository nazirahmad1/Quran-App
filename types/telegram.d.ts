export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}


// interface TelegramWebApp {
//   ready: () => void;
//   expand: () => void;
//   initData: string;
//   initDataUnsafe: any;
// }

// declare global {
//   interface Window {
//     Telegram?: {
//       WebApp: TelegramWebApp;
//     };
//   }
// }