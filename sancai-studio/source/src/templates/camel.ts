import type { SancaiTemplate, TemplateRegion } from '../domain/types';
import { unionSilhouette } from './geometry';
// A new, simplified caravan companion, with a two-hump profile and broad blanket.
const p = {
  farLegs: 'M433 590 L476 596 L467 706 L454 827 Q450 846 424 846 L407 839 L418 713Z M679 594 L722 594 Q749 651 739 706 L727 828 Q720 846 695 844 L681 836 L694 708 L671 646Z',
  tail: 'M787 453 Q827 424 852 453 Q870 476 861 506 L850 571 Q850 597 833 612 L819 593 Q830 573 829 554 L839 495 Q842 468 819 479 L802 498Z',
  body: 'M338 442 Q371 392 409 401 Q427 344 454 326 Q480 319 498 371 Q514 394 536 389 Q558 323 591 314 Q622 309 642 380 Q656 409 703 413 C777 418 825 463 826 533 C829 603 782 658 708 675 Q610 698 496 679 C407 682 337 634 321 563 Q309 500 338 442Z',
  neck: 'M206 154 Q213 141 222 156 L230 182 L251 178 Q282 190 291 223 Q304 255 292 287 C278 331 289 372 332 394 L375 425 Q387 462 356 486 Q330 501 306 477 C271 450 249 416 245 382 Q237 328 226 284 Q218 258 188 253 L154 261 C128 270 110 250 122 230 Q135 211 167 202 L197 191Z',
  backLeg: 'M724 606 Q761 607 779 637 Q789 660 772 692 L750 729 L746 820 Q745 836 765 843 L769 855 Q757 869 738 867 L707 863 Q690 857 695 836 L706 725 Q704 701 686 684Z',
  frontLeg: 'M379 609 Q407 600 434 624 L437 713 L426 824 Q428 837 448 843 L451 857 Q442 870 420 868 L388 862 Q375 856 379 839 L385 714 L368 652Z',
  mane: 'M229 299 Q255 311 262 342 Q255 356 266 372 Q260 391 276 409 Q276 431 296 447 L319 473 Q302 489 284 475 Q249 451 236 416 Q226 386 222 355Z',
  blanket: 'M423 427 Q519 447 647 427 L668 447 L680 583 Q677 601 656 606 L431 602 Q413 598 414 578 L408 448Z',
  saddle: 'M481 392 Q491 373 513 382 L533 407 L575 407 L592 381 Q611 370 625 393 L632 424 Q557 445 480 425Z',
  bridle: 'M145 214 L164 205 Q193 224 224 228 L230 243 Q189 246 132 231Z M248 194 L260 207 L247 269 L236 285 L224 280 L233 255Z M294 405 L308 395 Q327 425 367 444 L360 459 Q316 443 294 405Z',
  ornaments: 'M317 450 Q330 437 338 452 Q341 467 329 477 Q313 470 317 450Z M339 484 Q352 470 362 486 Q365 500 352 512 Q335 503 339 484Z M674 453 Q684 439 696 455 Q700 471 687 480 Q670 474 674 453Z M697 491 Q708 476 721 492 Q722 507 710 517 Q695 509 697 491Z',
  hooves: 'M412 825 Q434 830 454 823 L454 838 Q444 849 424 846 L407 839Z M684 827 Q703 832 725 825 L727 837 Q715 849 695 844 L681 836Z M380 837 Q407 844 442 837 L449 844 L451 857 Q442 870 420 868 L388 862 Q375 856 380 837Z M697 835 Q723 843 759 836 L768 848 L769 855 Q757 869 738 867 L707 863 Q690 857 697 835Z',
};
const r = (id: keyof typeof p, label: string, zIndex: number): TemplateRegion => ({ id, label, path: p[id], zIndex, editable: true, allowGlaze: true, flowGroup: id, flowDirection: [0, 1], reliefStrength: .15 });
export const camel: SancaiTemplate = {
  id: 'camel', version: 1, name: '驼铃伙伴', subtitle: '载着一小片斑斓出发',
  description: '长长脖子、小小双峰，在背毯上添上你的锦色。', viewBox: [0, 0, 1024, 1024],
  silhouette: unionSilhouette([p.farLegs, p.tail, p.body, p.neck, p.backLeg, p.frontLeg, p.mane, p.hooves]),
  silhouetteFillRule: 'nonzero', anchorBounds: { x: 107, y: 140, width: 766, height: 739 },
  regions: [r('farLegs', '后侧双腿', 0), r('tail', '尾巴', 1), r('body', '身体与双峰', 2), r('neck', '头与长颈', 3), r('backLeg', '后腿', 4), r('frontLeg', '前腿', 5), r('mane', '颈部绒毛', 6), r('blanket', '背毯', 7), r('saddle', '驼包', 8), r('bridle', '缰绳与饰带', 9), r('ornaments', '铃饰', 10), r('hooves', '脚掌', 11)],
  outlinePaths: [p.tail, p.body, p.neck, p.backLeg, p.frontLeg, p.mane, p.blanket, p.saddle, p.bridle, p.ornaments, p.hooves],
  detailPaths: [
    { path: 'M208 162 L218 184 L207 194Z', color: '#8E7054', opacity: .38 },
    { path: 'M218 215 C221 208 231 208 235 215 C240 224 233 235 225 234 Q214 231 218 215Z', color: '#47382D', opacity: 1 },
    { path: 'M221 214 Q226 209 230 215 Q230 220 225 219Z', color: '#FFF9E8', opacity: 1 },
    { path: 'M144 241 Q148 235 153 240 Q155 246 149 247Z', color: '#6C4E36', opacity: .9 },
    { path: 'M137 252 Q153 260 173 253', color: '#604831', opacity: .85, stroke: true, width: 3.5 },
    { path: 'M432 588 L660 592 M431 577 L660 581', color: '#F7E9CB', opacity: .7, stroke: true, width: 3 },
    { path: 'M236 344 L248 352 M242 375 L256 382 M253 405 L268 414 M272 433 L286 444', color: '#594330', opacity: .42, stroke: true, width: 3 },
    { path: 'M471 370 Q476 388 486 396 M597 358 Q601 386 612 399', color: '#765D42', opacity: .35, stroke: true, width: 3 },
  ], knowledgeSourceIds: ['S1', 'S4'],
};
