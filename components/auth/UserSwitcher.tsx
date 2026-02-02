
import React, { useState, useEffect } from 'react';
import { Users, LogOut, UserCheck, Shield } from 'lucide-react';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import { SiteUser } from '../../types';

interface UserSwitcherProps {
    onUserChange: (user: SiteUser | null) => void;
    onNavigate: (path: string) => void;
}

const UserSwitcher: React.FC<UserSwitcherProps> = ({ onUserChange, onNavigate }) => {
    const [allUsers, setAllUsers] = useState<SiteUser[]>([]);
    const [currentUser, setCurrentUser] = useState<SiteUser | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setAllUsers(userService.getUsers());
        setCurrentUser(authService.getCurrentSiteUser());
    }, []);

    const handleLogin = (userId: string) => {
        const user = authService.loginAsSiteUser(userId);
        setCurrentUser(user);
        onUserChange(user);
        setIsOpen(false);
    };

    const handleLogout = () => {
        authService.logoutSiteUser();
        setCurrentUser(null);
        onUserChange(null);
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-28 right-4 z-[200] no-print">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-3 bg-slate-800/80 backdrop-blur-md text-white rounded-full shadow-2xl border border-slate-700"
            >
                <Users size={18} />
                <span className="text-xs font-bold">{currentUser ? currentUser.email : 'No User'}</span>
            </button>

            {isOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 animate-fade-up">
                    <div className="p-2 text-xs font-bold text-slate-400 uppercase">Simulate Site User Login</div>
                    {allUsers.map(user => (
                        <button
                            key={user.id}
                            onClick={() => handleLogin(user.id)}
                            className="w-full text-left flex justify-between items-center p-3 rounded-lg hover:bg-slate-800"
                        >
                            <div>
                                <p className="text-sm text-white">{user.email}</p>
                                <p className="text-xs text-brand-gold">{user.membershipTier}</p>
                            </div>
                            {currentUser?.id === user.id && <UserCheck size={16} className="text-emerald-400" />}
                        </button>
                    ))}
                    <div className="border-t border-slate-700 my-1"></div>
                    {currentUser && (
                         <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-slate-800 text-slate-400"
                        >
                            <LogOut size={16} /> Logout Site User
                        </button>
                    )}
                     <div className="border-t border-slate-700 my-1"></div>
                      <button
                        onClick={() => {
                            onNavigate('/admin');
                            setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 text-slate-300"
                    >
                        <Shield size={16} /> 
                        <span className="font-semibold">Admin Login</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserSwitcher;
