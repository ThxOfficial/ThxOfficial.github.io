import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export default function Dialog({title,close,children}:{title:string;close:()=>void;children:ReactNode}) {
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    const trigger=document.activeElement instanceof HTMLElement?document.activeElement:null;
    ref.current?.showModal();
    return()=>{ref.current?.close();trigger?.focus();};
  },[]);
  return <dialog ref={ref} className="workshop-dialog" aria-labelledby="workshop-dialog-title" onCancel={e=>{e.preventDefault();close();}}>
    <div className="dialog-heading"><h2 id="workshop-dialog-title">{title}</h2><button className="icon-button" aria-label="关闭对话框" onClick={close}><X size={19}/></button></div>{children}
  </dialog>;
}
