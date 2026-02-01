const lazyDetector = function (detector: () => boolean): () => boolean {
  let result: boolean;
  return function () {
    if (typeof result === 'undefined') {
      result = detector();
    }
    return result;
  };
};

let userAgent: string;
const getUserAgent = (): string => {
  if (typeof userAgent === 'undefined') {
    userAgent = navigator.userAgent.toLowerCase();
  }
  return userAgent;
};

interface SupportProps {
  ios: () => boolean;
}

const Supports: SupportProps = {
  ios: lazyDetector(() => /(ipad|ipod|iphone)/i.test(getUserAgent())),
};

export default Supports;
