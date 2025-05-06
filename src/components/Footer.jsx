import React from 'react'

function Footer() {
    return (
        <footer className="footer sm:footer-horizontal footer-center bg-white text-black p-4">
            <aside>
                <p>Copyright {new Date().getFullYear()} - All right reserved by BugBusters</p>
            </aside>
        </footer>
    )
}

export default Footer