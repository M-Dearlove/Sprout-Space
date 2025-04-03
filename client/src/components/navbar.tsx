import { Disclosure, DisclosurePanel, DisclosureButton } from '@headlessui/react';
import { useState, useEffect } from 'react';
import '../styles/NavBar.css';

const allNavigation = [
    { name: 'Home', href: '#', current: true },
    { name: 'Design A Garden', href: '#', current: false },
    { name: 'Pest Search', href: '#', current: false },
    { name: 'Profile', href: '#', current: false },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function NavBar() {
    const [navigation, setNavigation] = useState([allNavigation[0]]); // Start with only Home
    
    useEffect(() => {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
            setNavigation(allNavigation); // Show all navigation items
        } else {
            setNavigation([allNavigation[0]]); // Show only Home
        }
    }, []);
    
    return (
        <Disclosure as="nav" className="navbar">
            {({ open }) => (
                <>
                    <div className="container">
                        <div className="navbar-content">
                            {/* Mobile Menu */}
                            <div className="mobile-menu-button">
                                <DisclosureButton className="menu-button">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    )}
                                </DisclosureButton>
                            </div>

                            {/* Logo and brand */}
                            <div className="brand-container">
                                <div className="brand">
                                    <span className="brand-name">Sprout Space</span>
                                </div>

                                {/* Desktop navigation */}
                                <div className="desktop-nav">
                                    <div className="nav-links">
                                        {navigation.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className={classNames(
                                                    item.current ? 'nav-link-active' : 'nav-link',
                                                )}
                                                aria-current={item.current ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    <DisclosurePanel className="mobile-nav">
                        <div className="mobile-nav-content">
                            {navigation.map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        item.current ? 'mobile-nav-link-active' : 'mobile-nav-link',
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </DisclosureButton>
                            ))}
                            
                            <div className="signup-button-container">
                                <button type="button" className="signup-button">
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
}