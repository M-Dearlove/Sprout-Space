import { Disclosure, DisclosurePanel, DisclosureButton } from '@headlessui/react';
import { useState, useEffect } from 'react';

const allNavigation = [
    { name: 'Home', href: '#', current: true },
    { name: 'Design A Garden', href: '#', current: false },
    { name: 'Pest Search', href: '#', current: false },
    { name: 'Profile', href: '#', current: false },
];

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default function NavBar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [navigation, setNavigation] = useState([allNavigation[0]]); // Start with only Home

    //added due to build error
    console.log(isAuthenticated)
    
    useEffect(() => {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
            setIsAuthenticated(true);
            setNavigation(allNavigation); // Show all navigation items
        } else {
            setIsAuthenticated(false);
            setNavigation([allNavigation[0]]); // Show only Home
        }
    }, []);
    
    return (
        <Disclosure as="nav" className="bg-gray-800">
            {({ open }: { open: boolean }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            {/* Mobile Menu */}
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus-ring-inset focus-ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    )}
                                </DisclosureButton>
                            </div>

                            {/* Logo and brand */}
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <span className="text-white font-bold text-xl">Sprout Space</span>
                                </div>

                                {/* Desktop navigation */}
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        {navigation.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className={classNames(
                                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                    'rounded-md px-3 py-2 text-sm font-medium'
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
                    <DisclosurePanel className="sm:hidden">
                        <div className="space-y-1 px-2 pt-2">
                            {navigation.map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </DisclosureButton>
                            ))}
                            
                            <div className="mt-4 px-3">
                                <button
                                    type="button"
                                    className="w-full rounded-md bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                >
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