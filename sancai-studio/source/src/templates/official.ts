import type { SancaiTemplate, TemplateRegion } from '../domain/types';
import { unionSilhouette } from './geometry';
// An original rounded, clasped-hands civil-official character.
const p = {
  base: 'M337 853 Q511 839 687 853 L709 885 Q712 902 691 908 L333 908 Q312 901 315 885Z',
  boots: 'M393 795 L464 792 L471 867 Q439 884 385 876 Q375 869 384 854Z M560 792 L630 795 L641 854 Q651 869 638 877 Q584 884 553 867Z',
  robe: 'M396 404 Q512 382 628 404 L664 455 L706 610 L681 827 Q515 868 343 827 L317 610 L356 455Z',
  innerRobe: 'M478 440 L550 440 L562 829 Q512 841 462 829Z',
  leftSleeve: 'M392 411 Q359 406 337 438 L273 550 Q253 591 269 621 L331 687 Q352 702 375 682 L468 574 L442 526 L367 584 L393 511Z',
  rightSleeve: 'M631 411 Q665 406 688 438 L751 550 Q773 591 755 621 L693 687 Q672 702 649 682 L555 574 L581 526 L657 584 L631 511Z',
  collar: 'M420 400 L478 389 L513 452 L551 389 L605 402 L568 495 L513 535 L460 493Z',
  belt: 'M389 650 Q513 675 636 650 L638 677 Q513 702 386 677Z',
  hat: 'M390 199 L383 151 Q390 122 413 129 L470 151 Q511 135 554 151 L608 131 Q634 119 643 149 L635 199 L626 222 L400 222Z',
  trim: 'M396 210 Q512 227 630 210 L627 231 Q513 245 400 231Z M502 691 L524 691 L534 798 L513 816 L493 798Z',
  face: 'M410 222 Q511 206 615 222 L622 294 C620 367 578 416 513 417 C448 417 405 367 402 294Z',
  hands: 'M452 533 Q463 516 483 523 L511 539 L535 521 Q558 514 573 531 L580 551 Q563 578 534 581 L492 580 Q463 578 446 553Z',
};
const r = (id: keyof typeof p, label: string, zIndex: number, editable = true): TemplateRegion => ({ id, label, path: p[id], zIndex, editable, allowGlaze: editable, flowGroup: id, flowDirection: [0, 1], reliefStrength: .14 });
export const official: SancaiTemplate = {
  id: 'official', version: 1, name: '拱手小文官', subtitle: '温和有礼，自成一色',
  description: '宽袖长袍，双手相拱。让一抹釉色落在衣袍与冠帽之间。', viewBox: [0, 0, 1024, 1024],
  silhouette: unionSilhouette([p.base, p.boots, p.robe, p.leftSleeve, p.rightSleeve, p.hat, p.face]),
  silhouetteFillRule: 'nonzero', anchorBounds: { x: 249, y: 116, width: 527, height: 800 },
  regions: [r('base', '底座', 0), r('boots', '鞋履', 1), r('robe', '外袍', 2), r('innerRobe', '内襟', 3), r('leftSleeve', '左袖', 4), r('rightSleeve', '右袖', 5), r('collar', '衣领', 6), r('belt', '腰带', 7), r('hat', '冠帽', 8), r('trim', '冠带与佩饰', 9), r('face', '面部（保护）', 10, false), r('hands', '双手（保护）', 11, false)],
  outlinePaths: [p.base, p.boots, p.robe, p.innerRobe, p.leftSleeve, p.rightSleeve, p.collar, p.belt, p.hat, p.trim],
  detailPaths: [
    { path: p.face, color: '#EEDDC3', opacity: 1 },
    { path: p.face, color: '#654E38', opacity: .85, stroke: true, width: 4 },
    { path: p.hands, color: '#EEDDC3', opacity: 1 },
    { path: p.hands, color: '#654E38', opacity: .85, stroke: true, width: 4 },
    { path: 'M445 299 Q459 283 474 298 M550 298 Q565 283 580 299', color: '#4B3C2E', opacity: 1, stroke: true, width: 6 },
    { path: 'M438 277 Q457 264 480 273 M545 273 Q567 264 586 277', color: '#6F5740', opacity: .8, stroke: true, width: 4 },
    { path: 'M511 299 Q501 323 511 327 L520 327', color: '#9E7859', opacity: .6, stroke: true, width: 3 },
    { path: 'M491 353 Q511 370 535 353', color: '#76513C', opacity: 1, stroke: true, width: 4 },
    { path: 'M456 329 Q468 322 477 333 Q468 343 456 338Z M549 333 Q561 322 572 329 L572 338 Q559 343 549 333Z', color: '#C98A70', opacity: .35 },
    { path: 'M480 541 L503 553 M484 551 L502 561 M526 543 L543 533 M528 554 L551 541', color: '#9F7E5F', opacity: .65, stroke: true, width: 3 },
    { path: 'M373 726 L365 800 M417 734 L406 809 M607 734 L618 809 M651 725 L661 797', color: '#785E43', opacity: .35, stroke: true, width: 3 },
    { path: 'M408 190 Q512 207 618 190', color: '#F7E9CB', opacity: .55, stroke: true, width: 4 },
  ], knowledgeSourceIds: ['S1', 'S7'],
};
