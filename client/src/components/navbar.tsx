import { Disclosure, DisclosurePanel, DisclosureButton } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/NavBar.css';

const allNavigation = [
    { name: 'Home', href: '/', current: true },
    { name: 'Garden Planner', href: '/garden-planner', current: false },
    { name: 'Pest Control', href: '/pest-control', current: false },
    { name: 'Profile', href: '/profile', current: false },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function NavBar() {
    const location = useLocation();
    const [navigation, setNavigation] = useState(
        allNavigation.map(item => ({
            ...item,
            current: item.href === '/' // Initialize with Home as current
        }))
    );

    useEffect(() => {
        // Check for token in localStorage
        const token = localStorage.getItem('id_token');

        // Update navigation items based on authentication
        if (token) {
            // Show all navigation items
            setNavigation(
                allNavigation.map(item => ({
                    ...item,
                    current: item.href === location.pathname // Set current based on path
                }))
            );
        } else {
            // Show only Home
            setNavigation([
                {
                    ...allNavigation[0],
                    current: location.pathname === '/'
                }
            ]);
        }
    }, [location.pathname]);

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
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                className={classNames(
                                                    location.pathname === item.href ? 'nav-link-active' : 'nav-link',
                                                )}
                                                aria-current={location.pathname === item.href ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </Link>
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
                                <div key={item.name}>
                                    <DisclosureButton as="div">
                                        <Link
                                            to={item.href}
                                            className={classNames(
                                                location.pathname === item.href ? 'mobile-nav-link-active' : 'mobile-nav-link',
                                            )}
                                            aria-current={location.pathname === item.href ? 'page' : undefined}
                                        >
                                            {item.name}
                                        </Link>
                                    </DisclosureButton>
                                </div>
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