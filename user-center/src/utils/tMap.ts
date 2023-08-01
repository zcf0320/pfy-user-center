
export function tMap (key:string) {
  return new Promise(function (resolve, reject) {
    // @ts-ignore
    window.initMap = function () {
      // @ts-ignore
      // eslint-disable-next-line no-undef
      resolve(TMap); // 注意这里
    };
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://map.qq.com/api/gljs?v=1.exp&callback=initMap&key=' + key;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
