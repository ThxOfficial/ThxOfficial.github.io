import type { SancaiTemplate, TemplateRegion } from '../domain/types';
import { unionSilhouette } from './geometry';

// Original character geometry. The rounded body, thick neck, saddle blanket and
// chest ornaments borrow broad Tang-horse features, not any one supplied image.
const paths = {
  farLegs: 'M436 587 Q454 582 474 598 L464 722 L451 817 Q449 839 426 840 L406 837 Q397 830 403 814 L415 711Z M704 587 L749 582 Q778 645 768 705 L742 812 Q739 837 715 840 L695 835 Q688 826 696 811 L719 704 L691 644Z',
  tail: 'M784 418 C833 393 877 417 883 454 C889 492 871 520 871 552 Q876 592 850 615 Q856 581 841 552 C827 523 853 492 834 469 Q821 452 800 471Z',
  body: 'M351 411 C402 376 466 365 544 371 C623 374 665 369 724 389 C802 408 841 452 838 525 C837 595 783 650 705 669 C642 688 562 677 499 672 L437 661 C369 647 323 592 323 530 C321 485 333 443 351 411Z',
  neck: 'M244 153 Q248 140 258 154 L277 188 L296 178 L315 137 Q322 128 330 142 L333 196 C374 210 394 244 395 298 C393 345 406 382 423 420 Q430 464 392 495 C360 505 338 477 326 442 C314 405 313 371 301 341 Q292 317 264 316 L221 329 C184 343 153 325 145 298 C136 277 154 254 177 237 L224 203Z',
  backLeg: 'M717 599 Q759 603 779 629 C797 655 780 692 760 717 L746 805 Q746 821 765 831 L771 847 Q766 861 748 861 L710 857 Q688 850 695 827 L704 712 Q700 689 681 673 L681 641Z',
  frontLeg: 'M383 596 Q411 588 439 611 L445 698 L432 809 Q433 827 451 836 L454 851 Q446 865 425 864 L391 860 Q374 854 378 837 L384 711 Q377 671 368 640Z',
  mane: 'M332 196 C368 201 397 221 407 255 Q419 284 412 313 Q419 340 413 366 L404 402 L377 423 Q375 388 364 360 Q369 334 356 310 Q361 283 346 264 Q350 235 326 216Z',
  blanket: 'M478 390 Q546 404 624 391 L665 409 L684 548 Q674 568 654 568 L475 564 Q453 561 451 542 L456 425Z',
  saddle: 'M500 384 Q513 361 531 377 L545 399 L604 399 Q619 372 638 382 L646 408 Q620 437 568 437 Q525 436 497 414Z',
  bridle: 'M182 237 L198 226 Q230 252 267 255 L267 271 Q219 269 172 252Z M302 202 L313 215 Q297 257 282 283 L273 327 L255 329 L267 278Z M319 349 Q339 384 372 411 L364 428 Q326 405 306 365Z',
  ornaments: 'M340 429 Q349 415 359 430 Q367 443 355 457 Q338 451 340 429Z M359 477 Q369 462 381 477 Q387 492 373 504 Q355 497 359 477Z M383 522 Q395 507 406 524 Q410 541 396 551 Q379 543 383 522Z M684 425 Q694 410 704 426 Q710 439 697 451 Q681 442 684 425Z M713 455 Q723 441 733 456 Q738 470 725 483 Q711 474 713 455Z M731 490 Q743 475 754 491 Q757 507 744 517 Q729 509 731 490Z',
  hooves: 'M407 817 Q428 823 450 817 L451 831 Q440 843 423 843 L406 840 Q397 833 407 817Z M699 819 Q719 824 740 818 L741 833 Q728 845 710 843 L695 838Z M380 834 Q407 842 444 832 L452 839 L454 851 Q444 865 425 864 L391 860 Q376 856 378 843Z M697 829 Q723 838 757 829 L768 839 L771 847 Q766 861 748 861 L710 857 Q692 851 697 829Z',
};
const region = (id: keyof typeof paths, label: string, zIndex: number): TemplateRegion => ({
  id, label, path: paths[id], zIndex, editable: true, allowGlaze: true,
  flowGroup: id, flowDirection: [0, 1], reliefStrength: .16,
});
export const horse: SancaiTemplate = {
  id: 'horse', version: 1, name: '唐彩小骏马', subtitle: '一匹盛唐的小小来客',
  description: '厚颈、丰厚的身体与小小鞍毯，留一点空白，也有自己的神气。',
  viewBox: [0, 0, 1024, 1024],
  silhouette: unionSilhouette([paths.farLegs, paths.tail, paths.body, paths.neck, paths.backLeg, paths.frontLeg, paths.mane, paths.hooves]),
  silhouetteFillRule: 'nonzero', anchorBounds: { x: 132, y: 126, width: 762, height: 747 },
  regions: [region('farLegs', '后侧双腿', 0), region('tail', '尾巴', 1), region('body', '身体', 2), region('neck', '头与颈', 3), region('backLeg', '后腿', 4), region('frontLeg', '前腿', 5), region('mane', '鬃毛', 6), region('blanket', '鞍毯', 7), region('saddle', '马鞍', 8), region('bridle', '缰绳与胸带', 9), region('ornaments', '杏叶胸饰', 10), region('hooves', '马蹄', 11)],
  outlinePaths: [paths.tail, paths.body, paths.neck, paths.backLeg, paths.frontLeg, paths.mane, paths.blanket, paths.saddle, paths.bridle, paths.ornaments, paths.hooves],
  detailPaths: [
    { path: 'M247 155 L257 188 L241 203Z M318 146 L320 185 L306 191Z', color: '#987458', opacity: .32 },
    { path: 'M206 280 C207 270 224 268 232 277 C238 290 224 303 213 299 C204 295 203 286 206 280Z', color: '#47382D', opacity: 1 },
    { path: 'M211 278 Q215 272 220 278 Q220 284 214 284Z', color: '#FFFCED', opacity: 1 },
    { path: 'M166 291 Q170 287 175 291 Q175 298 169 298Z', color: '#57402F', opacity: .85 },
    { path: 'M166 313 Q184 322 200 315', color: '#604831', opacity: .85, stroke: true, width: 4 },
    { path: 'M196 262 Q207 254 222 259', color: '#604831', opacity: .55, stroke: true, width: 3 },
    { path: 'M375 527 Q399 558 426 563 M728 584 Q758 571 769 544', color: '#765D42', opacity: .35, stroke: true, width: 3 },
    { path: 'M468 548 L665 551 M478 538 L657 541', color: '#F7E9CB', opacity: .65, stroke: true, width: 3 },
    { path: 'M385 242 L373 251 M396 271 L381 280 M399 306 L385 316 M404 341 L390 352 M396 377 L384 390', color: '#594330', opacity: .45, stroke: true, width: 3 },
  ],
  knowledgeSourceIds: ['S1', 'S4'],
};
