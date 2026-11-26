import type { SancaiTemplate, TemplateRegion } from '../domain/types';
import { unionSilhouette } from './geometry';
// A friendly guardian: one raised arm, layered armour, no trampling scene.
const p = {
  base: 'M322 854 Q513 838 704 854 L726 885 Q727 905 707 912 L318 912 Q297 905 300 885Z',
  legs: 'M394 666 L484 674 L476 815 L389 823 L372 762Z M540 674 L630 666 L651 762 L634 823 L549 815Z',
  boots: 'M391 797 L476 794 L478 851 Q455 881 373 873 Q361 866 371 851Z M548 794 L634 797 L654 851 Q666 866 652 873 Q571 881 547 851Z',
  leftArm: 'M366 420 Q329 417 313 451 L278 518 Q265 550 289 574 L353 624 L397 585 L335 537 L383 490Z',
  rightArm: 'M619 422 Q652 393 680 407 L719 428 L730 332 Q730 309 751 303 L778 310 Q797 324 788 349 L778 462 Q773 506 738 516 L658 491Z',
  chest: 'M394 397 Q511 375 631 397 L654 480 L623 606 Q511 641 400 606 L370 480Z',
  skirt: 'M397 586 Q510 615 626 586 L657 686 Q594 725 511 730 Q429 725 366 686Z',
  leftShoulder: 'M359 401 Q386 383 414 404 L425 447 L388 475 L330 449Z',
  rightShoulder: 'M609 404 Q641 383 669 401 L693 449 L635 475 L598 447Z',
  helmet: 'M425 208 Q432 175 476 168 L496 129 Q513 113 530 130 L548 168 Q591 176 602 208 L625 247 Q638 275 618 301 L584 310 L574 250 L449 250 L439 310 L406 301 Q385 277 399 248Z',
  belt: 'M397 580 Q512 608 626 580 L631 616 Q513 647 392 616Z',
  ornaments: 'M478 410 Q512 428 546 410 L561 456 L547 498 L513 516 L479 498 L464 456Z M490 585 L534 585 L545 613 L513 637 L480 613Z M411 651 L435 660 L429 692 L405 683Z M458 664 L482 669 L480 708 L456 703Z M541 669 L566 664 L568 703 L543 708Z M589 660 L613 651 L619 683 L595 692Z',
  face: 'M440 244 Q513 229 585 244 L590 303 C584 364 557 397 513 398 C467 397 440 364 433 304Z',
  hands: 'M302 548 Q311 529 330 537 L358 555 L376 568 L362 604 Q345 611 331 594 L305 578Z M729 324 L724 288 Q721 268 738 257 Q751 247 767 261 L789 282 Q800 297 786 313 L775 337Z',
};
const r = (id: keyof typeof p, label: string, zIndex: number, editable = true): TemplateRegion => ({ id, label, path: p[id], zIndex, editable, allowGlaze: editable, flowGroup: id, flowDirection: [0, 1], reliefStrength: .18 });
export const guardian: SancaiTemplate = {
  id: 'guardian', version: 1, name: '唐彩守护俑', subtitle: '有一点威风，也有一点可爱',
  description: '抬起手，穿上甲。用自己的釉色，赋予守护俑新的神气。', viewBox: [0, 0, 1024, 1024],
  silhouette: unionSilhouette([p.base, p.legs, p.boots, p.leftArm, p.rightArm, p.chest, p.skirt, p.leftShoulder, p.rightShoulder, p.helmet, p.face, p.hands]),
  silhouetteFillRule: 'nonzero', anchorBounds: { x: 260, y: 112, width: 548, height: 809 },
  regions: [r('base', '底座', 0), r('legs', '腿甲', 1), r('boots', '鞋履', 2), r('leftArm', '左护臂', 3), r('rightArm', '右护臂', 4), r('chest', '胸甲', 5), r('skirt', '裙甲', 6), r('leftShoulder', '左护肩', 7), r('rightShoulder', '右护肩', 8), r('helmet', '头盔', 9), r('belt', '腰带', 10), r('ornaments', '甲饰', 11), r('face', '面部（保护）', 12, false), r('hands', '双手（保护）', 13, false)],
  outlinePaths: [p.base, p.legs, p.boots, p.leftArm, p.rightArm, p.chest, p.skirt, p.leftShoulder, p.rightShoulder, p.helmet, p.belt, p.ornaments],
  detailPaths: [
    { path: p.face, color: '#EEDDC3', opacity: 1 }, { path: p.face, color: '#654E38', opacity: .9, stroke: true, width: 4 },
    { path: p.hands, color: '#EEDDC3', opacity: 1 }, { path: p.hands, color: '#654E38', opacity: .9, stroke: true, width: 4 },
    { path: 'M458 286 L481 280 M544 280 L568 286', color: '#61472F', opacity: .9, stroke: true, width: 6 },
    { path: 'M461 304 Q470 294 480 305 M544 305 Q554 294 565 304', color: '#47382D', opacity: 1, stroke: true, width: 5 },
    { path: 'M510 307 L503 327 L518 328', color: '#9F7859', opacity: .7, stroke: true, width: 3 },
    { path: 'M492 350 Q513 362 534 350', color: '#76513C', opacity: 1, stroke: true, width: 4 },
    { path: 'M462 208 Q513 190 565 208 M512 150 L512 221', color: '#F7E9CB', opacity: .6, stroke: true, width: 4 },
    { path: 'M404 507 Q423 523 439 518 M585 518 Q604 523 621 507 M410 548 Q425 560 441 556 M584 556 Q600 560 615 548', color: '#6B5036', opacity: .4, stroke: true, width: 3 },
    { path: 'M397 754 L472 754 M552 754 L637 754 M406 769 L470 769 M554 769 L630 769', color: '#EEDDC3', opacity: .55, stroke: true, width: 3 },
    { path: 'M741 274 L761 285 M739 286 L760 298 M319 553 L341 572', color: '#9F7E5F', opacity: .65, stroke: true, width: 3 },
  ], knowledgeSourceIds: ['S1', 'S7'],
};
