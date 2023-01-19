import styles from "./baseModal.module.css"
import CloseIcon from "../public/x.svg"
import { useEffect } from "react"

interface ModalProps {
    title?: string,
    content?: string,
    children?: any,
    important?: boolean,
    className?: string,
    open?: boolean,
    dialogRef: any

}
const BaseModal = ({ title, content, children, important, className, open, dialogRef }: ModalProps) => {


    return <dialog className={`${className} ${styles.baseModal}`} ref={dialogRef} open={open} >
        <button className={styles.closeButton} onClick={() => { dialogRef.current.close() }} ><CloseIcon /></button>
        <div className={``}>
            <h1 className="">{title}</h1>
            {content && content}
            {children}
        </div>
    </dialog >
}

export default BaseModal