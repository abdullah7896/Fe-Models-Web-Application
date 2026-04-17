import { renderToString } from 'react-dom/server.node';
import App from './App';

export function render(url: string): string {
  const appHtml = renderToString(<App url={url} />);
  return `<div id=\"root\">${appHtml}</div>`;
}
