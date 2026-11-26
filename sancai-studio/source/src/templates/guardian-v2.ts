import type { SancaiTemplate, TemplateRegion } from '../domain/types';
import { unionSilhouette } from './geometry';
const p={
  base:'M337 870 Q502 852 672 867 L696 894 Q687 911 659 914 L339 914 Q315 910 318 895Z',
  legs:'M400 644 L488 655 L474 805 L398 830 L376 756Z M531 652 L615 638 L651 756 L621 825 L545 804Z',
  boots:'M399 797 L470 795 L473 855 Q443 886 375 885 Q359 881 373 865Z M545 796 L616 795 L644 850 L667 869 Q677 880 657 886 Q601 889 551 865Z',
  leftArm:'M378 370 Q345 368 321 401 L273 480 Q260 509 284 532 L354 590 L391 554 L324 502 L393 432Z',
  rightArm:'M601 367 Q635 351 660 373 L694 400 Q715 373 721 341 L727 288 L758 285 Q776 335 762 385 C754 433 737 469 705 480 Q681 486 653 461 L609 429Z',
  chest:'M412 352 Q505 331 596 352 L631 418 Q633 482 603 552 Q508 585 407 550 C381 507 369 466 378 420Z',
  skirt:'M403 536 Q507 566 609 533 L645 647 Q617 692 520 726 Q418 704 365 662Z',
  leftShoulder:'M360 354 Q388 332 419 351 Q437 368 428 393 L403 419 Q367 412 335 390Z',
  rightShoulder:'M591 351 Q623 330 650 352 L682 393 Q650 413 612 419 L584 390Z',
  helmet:'M448 199 C447 170 458 147 481 139 L493 106 Q502 92 514 106 L529 139 C554 148 568 168 569 199 L589 221 Q599 247 584 265 L561 273 L553 216 L465 218 L458 273 L436 267 Q418 247 432 223Z',
  belt:'M400 532 Q507 557 610 530 L618 564 Q506 595 393 565Z',
  ornaments:'M455 375 Q477 365 494 388 L505 430 L491 479 Q468 490 444 476 L430 438Z M529 387 Q549 363 570 373 L589 435 L576 477 Q551 493 528 480 L516 430Z M490 542 L520 542 L534 561 L506 583 L479 564Z',
  face:'M461 214 Q507 200 553 213 L555 260 C549 305 530 335 508 339 C480 330 462 304 458 263Z',
  hands:'M296 495 Q307 483 321 491 L343 506 L365 526 Q373 543 359 554 L345 551 L322 532 L299 517Z M726 305 L719 281 L712 264 Q709 251 720 246 Q728 243 735 255 L741 267 L738 242 Q737 229 747 229 Q758 229 759 244 L770 271 Q776 285 763 299 L749 312Z',
};
const r=(id:keyof typeof p,label:string,zIndex:number,editable=true):TemplateRegion=>({id,label,path:p[id],zIndex,editable,allowGlaze:editable,flowGroup:id,flowDirection:[0,1],reliefStrength:.12});
export const guardianV2:SancaiTemplate={id:'guardian',version:2,name:'唐彩守护俑',subtitle:'甲饰卷云，抬臂生风',description:'抬臂与甲胄构成舒展的站姿，圆转肩甲、卷云细线与修长比例保留守护俑的神气。',viewBox:[0,0,1024,1024],silhouette:unionSilhouette([p.base,p.legs,p.boots,p.leftArm,p.rightArm,p.chest,p.skirt,p.leftShoulder,p.rightShoulder,p.helmet,p.face,p.hands]),silhouetteFillRule:'nonzero',anchorBounds:{x:254,y:89,width:530,height:835},outlineWidth:2.4,outlineColor:'#674832',
regions:[r('base','底座',0),r('legs','腿甲',1),r('boots','鞋履',2),r('leftArm','左护臂',3),r('rightArm','右护臂',4),r('chest','胸甲',5),r('skirt','裙甲',6),r('leftShoulder','左护肩',7),r('rightShoulder','右护肩',8),r('helmet','头盔',9),r('belt','腰带',10),r('ornaments','胸甲饰片',11),r('face','面部（保护）',12,false),r('hands','双手（保护）',13,false)],
outlinePaths:[p.base,p.boots,'M400 644 L376 756 L398 806 M488 692 L474 805 M615 638 L651 756 L621 805 M531 694 L545 804',p.leftArm,p.rightArm,'M412 352 L378 420 Q369 466 395 528 M603 528 Q633 482 631 418 L596 352',p.skirt,p.leftShoulder,p.rightShoulder,p.helmet,p.belt,p.ornaments],
detailPaths:[
{path:p.face,color:'#ECD9BA',opacity:1},{path:p.face,color:'#6B4B32',opacity:.9,stroke:true,width:2},
{path:p.hands,color:'#ECD9BA',opacity:1},{path:p.hands,color:'#6B4B32',opacity:.9,stroke:true,width:2},
{path:'M470 245 L488 239 M526 239 L545 244 M472 253 Q481 249 489 254 M526 254 Q535 248 543 253',color:'#63422B',opacity:.95,stroke:true,width:2},
{path:'M506 251 L499 274 Q507 279 515 272 M492 297 Q507 289 523 296 M494 305 Q508 312 523 303',color:'#845636',opacity:.9,stroke:true,width:1.5},
{path:'M475 280 Q475 301 486 312 M537 281 Q537 298 528 312 M490 321 Q508 335 526 321',color:'#765035',opacity:.65,stroke:true,width:1.4},
{path:'M456 190 Q507 174 561 192 M505 120 L507 200 M442 238 Q449 220 460 223 M573 225 Q581 231 580 245',color:'#9C7951',opacity:.65,stroke:true,width:1.7},
{path:'M358 374 C378 355 408 359 405 376 Q397 391 384 381 Q379 373 390 370 M616 373 C626 356 653 363 654 380 Q646 395 635 382 Q632 376 639 373',color:'#795232',opacity:.8,stroke:true,width:1.7},
{path:'M448 419 Q460 398 476 417 Q482 435 468 442 Q457 443 456 433 M540 418 Q553 397 569 418 Q576 435 560 444 Q548 444 547 433',color:'#86613D',opacity:.7,stroke:true,width:1.5},
{path:'M391 599 Q509 636 621 590 M383 622 Q507 661 629 614 M376 645 Q509 686 634 638 M409 587 L399 668 M438 597 L430 682 M469 604 L463 697 M501 608 L502 707 M533 605 L539 698 M565 599 L575 685 M596 589 L607 671',color:'#86613D',opacity:.6,stroke:true,width:1.4},
{path:'M398 744 Q431 757 471 747 M547 746 Q580 754 631 742 M408 763 Q438 775 469 765 M552 765 Q583 774 622 761 M291 488 L317 513 M692 401 Q707 420 722 421 M733 251 L747 277 M726 267 L741 288 M310 501 L331 518',color:'#8D6945',opacity:.55,stroke:true,width:1.5},
],knowledgeSourceIds:['S1','S7']};
