import type { SancaiTemplate, TemplateRegion } from '../domain/types';
import { unionSilhouette } from './geometry';

const pieces = {
  handle: 'M578 246 C683 184 793 213 795 330 C796 460 730 560 645 604 L618 565 C693 525 751 425 749 334 C748 265 682 236 576 294 Z',
  spout: 'M369 534 Q329 460 304 375 L264 315 L289 294 Q333 310 354 362 Q383 424 420 478 Z',
  foot: 'M361 781 L657 781 Q673 813 708 831 L704 869 Q511 909 319 869 L314 834 Q346 819 361 781 Z',
  body: 'M438 365 L594 365 C625 438 710 461 751 549 C806 670 733 772 660 807 C593 843 421 843 355 808 C268 765 227 671 265 566 C295 482 398 435 438 365 Z',
  shoulder: 'M437 363 Q518 383 594 363 Q623 431 694 473 C642 505 389 513 329 487 C366 449 414 423 437 363 Z',
  neck: 'M443 224 Q512 245 595 222 C578 272 573 310 594 363 C553 400 470 400 437 363 C451 309 454 274 443 224 Z',
  rim: 'M391 174 Q512 147 636 174 L627 221 Q513 260 406 224 Z',
  band: 'M280 548 Q511 597 748 540 L760 578 Q516 632 267 583 Z',
  panel: 'M511 620 Q571 623 604 682 Q573 745 511 763 Q447 746 418 685 Q450 622 511 620 Z',
};
const areas: [keyof typeof pieces, string][] = [
  ['handle', '把手'], ['spout', '壶嘴'], ['foot', '圈足'], ['body', '器腹'], ['shoulder', '壶肩'],
  ['neck', '壶颈'], ['rim', '口沿'], ['band', '装饰带'], ['panel', '腹部花饰'],
];
const regions: TemplateRegion[] = areas.map(([id, label], zIndex) => ({
  id, label, zIndex, path: pieces[id], editable: true, allowGlaze: true,
  flowGroup: id, flowDirection: [0, 1], reliefStrength: .15,
}));

export const vessel: SancaiTemplate = {
  id: 'vessel', version: 1, name: '三彩执壶', subtitle: '从壶口到圈足，都能单独上色',
  description: '从唐代彩釉器皿取形。器腹留了较大的上色区，可以试试点彩或流带。',
  viewBox: [0, 0, 1024, 1024], silhouette: unionSilhouette(Object.values(pieces)),
  silhouetteFillRule: 'nonzero', anchorBounds: {x: 246, y: 150, width: 560, height: 755},
  regions, outlineWidth: 3, outlineColor: '#60452f',
  outlinePaths: [
    pieces.rim, pieces.neck, pieces.shoulder, pieces.band, pieces.panel,
    'M329 487 C295 514 277 539 265 566 C227 671 268 765 355 808 C421 843 593 843 660 807 C733 772 806 670 751 549 Q732 504 694 473',
    'M591 238 C688 194 793 213 795 330 Q800 437 736 524 M711 497 Q750 409 749 334 C748 265 682 236 586 288',
    'M348 477 Q324 426 304 375 L264 315 L289 294 Q333 310 354 362 Q376 413 395 444 M264 315 Q278 319 295 304',
    'M356 805 Q345 819 314 834 L319 869 Q511 909 704 869 L708 831 Q680 818 660 807',
  ],
  detailPaths: [
    {path:'M411 181 Q510 158 616 181 Q512 205 411 181 Z', color:'#6d4f38', opacity:.24},
    {path:'M282 608 Q259 738 384 791 M728 617 Q747 717 660 775 M353 854 Q511 881 669 854', color:'#805f43', opacity:.55, stroke:true, width:2.4},
    {path:'M511 643 Q510 681 556 680 Q524 699 511 741 Q487 701 465 680 Q505 683 511 643 Z', color:'#74583e', opacity:.6, stroke:true, width:2},
  ], knowledgeSourceIds: ['S8'],
};
