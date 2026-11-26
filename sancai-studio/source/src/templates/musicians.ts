import type { SancaiTemplate, TemplateRegion } from '../domain/types';
import { camelV3 } from './camel-v3';
import { unionSilhouette } from './geometry';

// The existing camel is drawn at the same scale on both axes. The band is a
// separate set of paths so coats, headwear and instruments each accept glaze.
function moveCamel(path: string) {
  return path.replace(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g, (_, x, y) =>
    `${Math.round(Number(x) * .84 + 72)} ${Math.round(Number(y) * .84 + 158)}`);
}

const garments = [
  { id:'cushion', label:'驼背坐垫', path:'M411 398 Q456 383 515 398 Q596 411 655 396 Q711 379 735 405 L720 445 Q660 461 575 456 Q487 455 424 441 Q412 425 411 398 Z' },
  { id:'leftRobe', label:'左侧乐人衣袍', path:'M438 305 Q455 294 474 305 Q492 326 492 365 L505 396 Q487 424 419 413 Q405 405 414 383 L423 342 Q426 321 438 305 Z' },
  { id:'rightRobe', label:'右侧乐人衣袍', path:'M637 307 Q660 292 681 314 L699 353 Q720 366 735 394 Q733 417 676 425 L620 403 Q612 389 629 365 Z' },
  { id:'leadRobe', label:'中间乐人衣袍', path:'M528 265 Q551 244 582 262 Q615 276 624 316 L642 365 Q650 393 624 419 Q577 443 504 408 Q484 394 494 368 L503 321 Q511 282 528 265 Z' },
  { id:'heads', label:'乐人面部', path:'M420 274 Q422 252 443 246 Q466 246 477 271 Q480 292 461 310 Q439 316 425 295 Z M640 278 Q643 249 665 248 Q689 249 694 277 Q695 297 676 314 Q652 318 642 297 Z M521 212 Q526 183 554 181 Q583 181 592 211 Q602 233 581 256 Q551 271 530 249 Z' },
  { id:'hats', label:'乐人冠帽', path:'M416 270 Q411 239 437 231 Q463 226 476 251 L478 271 Q439 260 416 270 Z M636 271 Q631 240 655 230 Q685 227 693 250 L698 272 Q667 261 636 271 Z M516 207 Q510 170 544 164 Q571 148 590 174 L596 205 Q559 192 516 207 Z' },
  { id:'instruments', label:'乐器', path:'M443 334 L482 307 L489 316 L455 348 Q473 372 455 389 C435 402 413 374 425 354 Q431 342 443 334 Z M547 325 L594 272 Q603 263 609 271 L611 282 L566 338 Q581 355 571 378 C555 409 524 398 521 375 Q519 348 547 325 Z M656 352 Q678 339 704 351 L711 377 Q699 397 669 397 Q650 390 649 370 Z' },
];
const base = camelV3.regions.map(r => ({...r, path:moveCamel(r.path)}));
const camelOutlines = camelV3.outlinePaths.map((path,i)=>i===2
  ? 'M346 520 C370 510 390 498 415 479 L439 445 M718 444 Q735 479 754 499 Q771 512 785 523 Q817 546 771 589'
  : moveCamel(path));
const regions: TemplateRegion[] = [...base, ...garments.map((r,i) => ({
  ...r, zIndex:base.length+i, editable:true, allowGlaze:true, flowGroup:r.id,
  flowDirection:[0,1] as [number,number], reliefStrength:.12,
}))];

export const musicians: SancaiTemplate = {
  id:'musicians', version:1, name:'三彩载乐驼', subtitle:'给骆驼、三位乐人和乐器配色',
  description:'参考载乐俑的构图，三位乐人坐在驼背上。衣袍、面部、冠帽和乐器各有上色区。',
  viewBox:[0,0,1024,1024], silhouetteFillRule:'nonzero',
  silhouette:unionSilhouette([moveCamel(camelV3.silhouette), ...garments.map(r=>r.path)]),
  anchorBounds:{x:151,y:151,width:655,height:762}, regions,
  outlineWidth:2.7, outlineColor:'#60452f',
  outlinePaths:[...camelOutlines, ...garments.map(r=>r.path)],
  detailPaths:[
    ...camelV3.detailPaths.map(detail=>({...detail,path:moveCamel(detail.path)})),
    {path:'M433 278 L442 278 M455 278 L464 278 M443 292 Q448 296 455 292 M650 281 L659 281 M674 279 L683 279 M661 294 Q668 300 674 294 M535 218 L548 218 M566 216 L578 216 M548 239 Q556 244 567 238 M529 290 Q538 309 554 313 M578 288 Q585 301 595 309 M542 371 L596 279 M434 371 L481 316 M658 362 Q682 366 704 358 M668 372 L670 387 M681 371 L683 390 M694 368 L695 385',color:'#674a33',opacity:.82,stroke:true,width:2.5},
  ], knowledgeSourceIds:['S7'],
};
