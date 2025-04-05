import '../styles/Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <p>&copy; {new Date().getFullYear()} Sprout Space. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}