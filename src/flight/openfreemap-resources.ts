import {addProtocol} from 'maplibre-gl';

let installed = false;
export const installOpenFreeMapResources = () => {
  if (installed) return;
  installed = true;
  addProtocol('ofm', async (params, controller) => {
    const url = params.url.replace('ofm://', 'https://');
    let lastError: unknown;
    // Resource retries only; the animation clock is never advanced here.
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const response = await fetch(url, {signal:controller.signal, cache:'force-cache'});
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
        return {data:await response.arrayBuffer()};
      } catch (error) {
        if(controller.signal.aborted) throw error;
        lastError=error;
      }
    }
    throw new Error(`资源重试 4 次后仍失败 ${url}: ${String(lastError)}`);
  });
};
