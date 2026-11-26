import type { SancaiTemplate, TemplateRegion } from '../domain/types';
import { unionSilhouette } from './geometry';

// Frontal civil-official figure: narrow standing silhouette, a double-lobed
// court crown, crossed lapels, folded hands and sleeves hanging down, not out.
const p={
  base:'M379 895 Q509 879 640 895 L653 923 Q640 944 607 947 L407 947 Q373 944 365 925Z',
  boots:'M431 823 L491 824 L491 878 Q482 901 440 908 L408 906 Q397 898 410 885 L427 871Z M532 823 L592 821 L598 870 L617 883 Q629 896 617 905 L579 908 Q545 901 533 882Z',
  robe:'M451 346 Q507 335 560 346 L594 384 Q613 432 609 507 L600 632 L615 866 Q594 890 547 891 L512 872 Q483 894 446 891 L410 872 L423 654 L418 499 Q416 420 432 380Z',
  innerRobe:'M485 376 L525 374 L538 643 L552 871 Q532 884 511 872 Q490 887 468 879 L484 636Z',
  leftSleeve:'M445 355 C413 358 392 382 385 416 L367 501 C357 528 365 553 381 572 L389 700 Q394 747 423 753 Q459 751 466 712 L478 577 L489 485 L467 462 L411 502 L429 429Z',
  rightSleeve:'M562 354 C596 360 618 384 624 420 L643 503 Q656 543 630 575 L623 699 Q617 743 591 750 Q555 746 548 710 L536 579 L525 484 L546 461 L600 502 L582 427Z',
  collar:'M452 344 L478 328 L508 379 L541 329 L563 345 L523 420 L504 443 L469 396Z',
  belt:'M421 510 Q509 523 609 510 L609 532 Q515 550 420 532Z',
  hat:'M458 210 C435 199 429 183 429 158 C429 127 442 112 462 116 Q485 120 494 142 L507 154 L522 141 Q533 115 554 116 C578 117 589 139 585 165 C582 190 566 205 552 211 L535 220 L475 220Z M492 143 L492 121 L525 121 L527 150Z',
  trim:'M457 208 Q510 217 557 207 L560 225 Q509 235 455 225Z M488 551 L528 551 L529 583 L515 591 L526 692 L512 711 L496 693 L503 592 L488 583Z',
  face:'M489 316 L532 317 L530 345 L508 369 L490 345Z M459 231 Q510 215 558 232 L558 274 Q551 309 532 326 L513 337 Q494 337 478 321 Q461 304 459 281 L450 270 L451 250Z',
  hands:'M474 477 Q483 468 497 474 L512 482 L532 471 Q545 466 550 477 L555 493 Q546 511 524 514 L500 511 L481 505 L470 494Z',
};
const r=(id:keyof typeof p,label:string,zIndex:number,editable=true):TemplateRegion=>({id,label,path:p[id],zIndex,editable,allowGlaze:editable,flowGroup:id,flowDirection:[0,1],reliefStrength:.13});
export const officialV3:SancaiTemplate={id:'official',version:3,name:'拱手文官',subtitle:'冠端袖垂，拱手肃立',description:'参照文官陶俑的双叶冠、交领与拱手姿势，以自然下垂的宽袖和修长袍身重建轮廓。',viewBox:[0,0,1024,1024],silhouette:unionSilhouette([p.base,p.boots,p.robe,p.leftSleeve,p.rightSleeve,p.hat,p.trim,p.face]),silhouetteFillRule:'nonzero',anchorBounds:{x:357,y:110,width:301,height:842},outlineWidth:2.6,outlineColor:'#654A33',
  regions:[r('base','底座',0),r('boots','鞋履',1),r('robe','外袍',2),r('innerRobe','内襟',3),r('leftSleeve','左垂袖',4),r('rightSleeve','右垂袖',5),r('collar','交领',6),r('belt','腰带',7),r('hat','冠帽',8),r('trim','冠带与佩饰',9),r('face','面部（保护）',10,false),r('hands','双手（保护）',11,false)],
  outlinePaths:[p.base,'M427 879 L410 885 Q397 898 408 906 L440 908 Q473 903 486 889 M543 892 Q558 902 579 908 L617 905 Q629 896 617 883 L604 875',p.hat,p.trim,p.collar,p.belt,
    'M445 355 C413 358 392 382 385 416 L367 501 C357 528 365 553 381 572 L389 700 Q394 747 423 753 Q459 751 466 712 L478 577 L489 485',
    'M562 354 C596 360 618 384 624 420 L643 503 Q656 543 630 575 L623 699 Q617 743 591 750 Q555 746 548 710 L536 579 L525 484',
    'M420 721 L410 872 L446 891 Q483 894 512 872 Q533 891 547 891 Q594 890 615 866 L608 721',
  ],detailPaths:[
    {path:p.face,color:'#E7D6B9',opacity:1},{path:p.face.slice(p.face.indexOf('M459'))+' M490 334 L490 345 L508 369 L530 345 L531 334',color:'#705039',opacity:.9,stroke:true,width:2.2},
    {path:p.hands,color:'#E7D6B9',opacity:1},{path:p.hands,color:'#705039',opacity:.9,stroke:true,width:2},
    {path:'M462 238 Q504 220 551 235 L552 245 Q527 233 513 237 Q484 229 463 247Z',color:'#93704E',opacity:.65},
    {path:'M470 258 Q482 250 494 257 M526 256 Q539 249 549 257 M473 266 Q482 271 491 265 M527 265 Q537 271 546 264',color:'#67472F',opacity:.95,stroke:true,width:2.1,facialLine:true},
    {path:'M510 259 L503 282 Q509 288 516 282 M491 300 Q504 293 513 299 Q526 292 537 298 M497 308 Q511 314 526 306',color:'#886043',opacity:.9,stroke:true,width:1.8,facialLine:true},
    {path:'M484 294 Q485 311 497 314 M534 294 Q535 308 525 315 M503 320 L512 329 L520 319 M459 254 L459 271',color:'#7C573A',opacity:.8,stroke:true,width:1.7},
    {path:'M443 139 Q439 170 452 191 Q465 210 484 207 M570 140 Q582 174 554 199 M496 135 L521 135 M495 145 L522 145 M503 164 L504 200 M517 163 L517 200',color:'#98734F',opacity:.65,stroke:true,width:1.8},
    {path:'M412 398 Q399 443 393 492 M430 425 Q413 476 408 497 M600 401 Q614 452 616 493 M580 426 Q597 475 602 498 M382 531 Q414 522 466 491 M633 532 Q596 521 547 491 M387 555 Q418 545 467 511 M626 556 Q586 543 548 512',color:'#805D3E',opacity:.65,stroke:true,width:1.8},
    {path:'M398 578 Q413 605 407 681 Q405 718 418 739 M449 560 L440 715 Q435 739 424 742 M611 580 Q597 626 602 683 Q608 716 592 738 M566 560 L572 708 Q578 736 589 740 M430 779 L424 859 M460 760 L452 876 M490 719 L482 876 M536 718 L545 876 M574 765 L586 865 M598 791 L604 855',color:'#886546',opacity:.6,stroke:true,width:1.8},
    {path:'M478 485 L499 496 M481 479 L502 490 M523 485 L542 478 M524 494 L546 486',color:'#9A7451',opacity:.75,stroke:true,width:1.6},
    {path:'M385 916 Q506 931 637 914 M394 928 Q512 943 630 927',color:'#8D6846',opacity:.7,stroke:true,width:1.9},
  ],expressions:{
    smile:[{path:'M471 256 Q482 248 494 255 M526 254 Q537 247 548 254 M473 269 Q483 259 492 267 M527 267 Q536 258 546 267 M510 259 L503 282 Q509 287 516 282 M493 299 Q510 315 532 297',color:'#7a4c38',opacity:1,stroke:true,width:2.8}],
    alert:[{path:'M470 256 L493 259 M526 258 L549 254 M469 270 Q483 259 494 269 Q482 275 469 270 M525 269 Q538 258 549 267 Q538 275 525 269 M510 259 L502 282 Q509 288 518 281 M495 302 Q512 299 529 302',color:'#704831',opacity:1,stroke:true,width:2.6}],
  },knowledgeSourceIds:['S1','S7']};
