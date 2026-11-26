import type { SancaiTemplate, TemplateRegion } from '../domain/types';
import { unionSilhouette } from './geometry';
const p={
  base:'M359 867 Q501 854 651 867 L674 893 Q667 909 641 912 L366 912 Q340 907 341 897Z',
  boots:'M418 810 L478 813 L480 863 Q467 884 413 886 Q397 884 406 873Z M548 812 L604 807 L617 863 L640 876 Q644 886 624 889 L553 881Z',
  robe:'M438 347 Q503 327 571 345 C600 376 605 428 611 486 L640 676 L657 861 C594 884 428 893 366 864 L382 702 L395 503 Q393 410 412 369Z',
  innerRobe:'M485 377 L527 372 L553 861 Q517 872 472 868 L482 683Z',
  leftSleeve:'M435 349 Q398 338 373 370 C351 405 340 447 324 487 C306 530 301 563 323 591 L375 631 Q403 631 421 606 L484 515 L466 470 L391 532 Q375 515 389 487 L424 435Z',
  rightSleeve:'M565 347 Q602 338 628 370 C652 414 661 451 678 487 C699 533 698 565 676 590 L623 627 Q601 626 581 601 L526 513 L544 470 L613 525 Q633 505 618 477 L578 425Z',
  collar:'M448 348 L478 328 L508 393 L540 329 L568 348 L536 432 L506 455 L473 424Z',
  belt:'M402 565 Q505 581 609 562 L611 582 Q504 604 400 585Z',
  hat:'M447 193 C445 173 420 150 418 127 C414 99 434 89 454 109 L493 145 L513 146 L553 109 C576 87 595 102 590 129 C587 154 567 172 565 194 L557 207 L456 209Z',
  trim:'M445 193 Q506 180 568 192 L568 211 Q505 221 446 212Z M497 598 L516 597 L526 724 L509 744 L491 726Z',
  face:'M450 217 Q504 199 560 214 L561 261 Q552 314 515 337 Q493 345 473 324 Q449 303 446 264Z',
  hands:'M468 468 Q478 453 494 460 L507 474 L522 457 Q533 447 546 459 L558 475 Q545 500 522 505 L497 503 Q476 496 464 482Z',
};
const r=(id:keyof typeof p,label:string,zIndex:number,editable=true):TemplateRegion=>({id,label,path:p[id],zIndex,editable,allowGlaze:editable,flowGroup:id,flowDirection:[0,1],reliefStrength:.12});
export const officialV2:SancaiTemplate={id:'official',version:2,name:'拱手文官',subtitle:'衣褶舒展，冠带从容',description:'保留冠帽、拱手和长袍的识别特征，用修长比例、衣褶细线与舒展的袖形表达文官的温雅。',viewBox:[0,0,1024,1024],silhouette:unionSilhouette([p.base,p.boots,p.robe,p.leftSleeve,p.rightSleeve,p.hat,p.face]),silhouetteFillRule:'nonzero',anchorBounds:{x:294,y:84,width:415,height:838},outlineWidth:2.3,outlineColor:'#694D36',
regions:[r('base','底座',0),r('boots','鞋履',1),r('robe','外袍',2),r('innerRobe','内襟',3),r('leftSleeve','左袖',4),r('rightSleeve','右袖',5),r('collar','交领',6),r('belt','腰带',7),r('hat','冠帽',8),r('trim','冠带与佩饰',9),r('face','面部（保护）',10,false),r('hands','双手（保护）',11,false)],
outlinePaths:[p.base,'M435 349 Q398 338 373 370 C351 405 340 447 324 487 C306 530 301 563 323 591 L375 631 Q403 631 421 606 L484 515','M565 347 Q602 338 628 370 C652 414 661 451 678 487 C699 533 698 565 676 590 L623 627 Q601 626 581 601 L526 513','M382 702 L366 864 C428 893 594 884 657 861 L640 676','M412 369 Q393 410 395 503 M611 486 Q605 428 590 385',p.collar,p.belt,p.hat,p.trim,p.boots],
detailPaths:[
{path:p.face,color:'#EDDEC6',opacity:1},{path:p.face,color:'#71513A',opacity:.9,stroke:true,width:2},
{path:p.hands,color:'#EDDEC6',opacity:1},{path:p.hands,color:'#71513A',opacity:.9,stroke:true,width:2},
{path:'M462 252 Q472 246 483 251 M525 250 Q538 244 549 251 M466 262 Q474 267 482 261 M527 260 Q536 265 544 260',color:'#654431',opacity:.95,stroke:true,width:1.9},
{path:'M505 258 L500 282 Q504 287 511 282 M494 302 Q508 310 523 300',color:'#8A6146',opacity:.8,stroke:true,width:1.5},
{path:'M479 298 Q477 316 492 321 M524 315 Q534 311 536 302 M496 316 L505 320 L514 315',color:'#80573B',opacity:.7,stroke:true,width:1.4},
{path:'M427 132 Q433 147 452 163 M579 128 Q575 147 562 160 M458 199 Q506 191 558 199',color:'#7F5A3C',opacity:.6,stroke:true,width:1.5},
{path:'M394 411 Q372 453 363 491 Q354 520 364 546 M424 433 Q398 492 385 513 M608 415 Q634 459 646 496 Q655 526 643 546 M581 435 Q606 486 615 507 M376 599 Q399 583 419 558 M623 596 Q600 580 582 551',color:'#7D5C3E',opacity:.65,stroke:true,width:1.6},
{path:'M416 615 Q412 702 394 823 M444 647 Q426 764 425 853 M581 629 Q601 735 611 847 M558 665 L570 859 M479 608 L472 858 M533 604 L550 856',color:'#876546',opacity:.5,stroke:true,width:1.5},
{path:'M475 477 L491 486 M480 470 L496 480 M522 478 L538 466 M525 487 L546 475',color:'#A27A57',opacity:.7,stroke:true,width:1.4},
],knowledgeSourceIds:['S1','S7']};
