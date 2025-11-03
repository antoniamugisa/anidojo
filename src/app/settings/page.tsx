'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Save, 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Eye, 
  Palette, 
  Shield, 
  Trash2, 
  LogOut, 
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Types
interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  email: boolean;
  push: boolean;
  site: boolean;
}

interface PrivacySetting {
  id: string;
  name: string;
  description: string;
  value: 'public' | 'friends' | 'private';
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Form states
  const [accountForm, setAccountForm] = useState({
    username: 'animefan92',
    email: 'user@example.com',
    displayName: 'Anime Fan',
    bio: 'Passionate anime enthusiast who loves discovering new series and sharing reviews with the community.',
    location: 'Tokyo, Japan',
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'new_follower',
      name: 'New Follower',
      description: 'When someone follows your profile',
      email: true,
      push: true,
      site: true
    },
    {
      id: 'comment_reply',
      name: 'Comment Replies',
      description: 'When someone replies to your comment',
      email: false,
      push: true,
      site: true
    },
    {
      id: 'review_like',
      name: 'Review Likes',
      description: 'When someone likes your review',
      email: false,
      push: false,
      site: true
    },
    {
      id: 'anime_update',
      name: 'Anime Updates',
      description: 'Updates for anime on your watchlist',
      email: true,
      push: true,
      site: true
    }
  ]);

  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>([
    {
      id: 'profile_visibility',
      name: 'Profile Visibility',
      description: 'Who can see your profile',
      value: 'public'
    },
    {
      id: 'anime_list',
      name: 'Anime List',
      description: 'Who can see your anime list',
      value: 'public'
    },
    {
      id: 'activity_feed',
      name: 'Activity Feed',
      description: 'Who can see your activity',
      value: 'friends'
    },
    {
      id: 'reviews',
      name: 'Reviews',
      description: 'Who can see your reviews',
      value: 'public'
    }
  ]);

  // Mock authentication - always show settings page for demo purposes
  useEffect(() => {
    // For demo purposes, we'll always show the settings page
    // In a real app, you would check authentication status
    // if (!isAuthenticated) {
    //   router.push('/signin');
    // }
    setLoading(false);
    
    // Simulate authenticated user by setting localStorage item if it doesn't exist
    if (!localStorage.getItem('anidojo_user')) {
      const mockUser = {
        id: '1',
        username: 'animefan92',
        email: 'user@example.com'
      };
      localStorage.setItem('anidojo_user', JSON.stringify(mockUser));
    }
  }, []);

  const handleAccountFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationToggle = (id: string, type: 'email' | 'push' | 'site') => {
    setNotificationSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, [type]: !setting[type] } : setting
    ));
  };

  const handlePrivacyChange = (id: string, value: 'public' | 'friends' | 'private') => {
    setPrivacySettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, value } : setting
    ));
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful save
    setSaveStatus('success');
    
    // Reset status after 3 seconds
    setTimeout(() => {
      setSaveStatus('idle');
    }, 3000);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion functionality would be implemented here.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center text-gray-400 text-sm gap-2 px-6 pt-6">
        <Link href="/dashboard" className="hover:text-white">Home</Link>
        <span className="mx-1">›</span>
        <span className="text-white">Settings</span>
      </nav>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <ul>
                {[
                  { id: 'account', label: 'Account', icon: <User className="w-5 h-5" /> },
                  { id: 'security', label: 'Security', icon: <Lock className="w-5 h-5" /> },
                  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
                  { id: 'privacy', label: 'Privacy', icon: <Shield className="w-5 h-5" /> },
                  { id: 'appearance', label: 'Appearance', icon: <Palette className="w-5 h-5" /> },
                  { id: 'language', label: 'Language', icon: <Globe className="w-5 h-5" /> },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-red-600/20 text-white border-l-4 border-red-600'
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === item.id ? 'rotate-90' : ''}`} />
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="border-t border-white/10 p-4">
                <button 
                  onClick={handleDeleteAccount}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-400 hover:bg-red-600/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete Account</span>
                </button>
                
                <button 
                  onClick={() => {
                    localStorage.removeItem('anidojo_user');
                    router.push('/signin');
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-300 hover:bg-white/10 rounded-lg transition-colors mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              {/* Account Settings */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={accountForm.username}
                        onChange={handleAccountFormChange}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={accountForm.email}
                        onChange={handleAccountFormChange}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        value={accountForm.displayName}
                        onChange={handleAccountFormChange}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={accountForm.bio}
                        onChange={handleAccountFormChange}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={accountForm.location}
                        onChange={handleAccountFormChange}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Change Password</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                      
                      <div className="bg-white/5 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white">Enable Two-Factor Authentication</p>
                            <p className="text-sm text-gray-400 mt-1">Add an extra layer of security to your account</p>
                          </div>
                          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                            Enable
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Sessions</h3>
                      
                      <div className="space-y-3">
                        <div className="bg-white/5 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-white">Current Session</p>
                              <p className="text-sm text-gray-400 mt-1">Mac • Chrome • Tokyo, Japan</p>
                            </div>
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                              Active
                            </span>
                          </div>
                        </div>
                        
                        <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                          Sign out of all other sessions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Notification Settings</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-white/10">
                        <tr>
                          <th className="text-left py-4 px-4 font-medium text-gray-300">Notification</th>
                          <th className="text-center py-4 px-4 font-medium text-gray-300">Email</th>
                          <th className="text-center py-4 px-4 font-medium text-gray-300">Push</th>
                          <th className="text-center py-4 px-4 font-medium text-gray-300">Site</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {notificationSettings.map((setting) => (
                          <tr key={setting.id}>
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-white">{setting.name}</p>
                                <p className="text-sm text-gray-400">{setting.description}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <button
                                onClick={() => handleNotificationToggle(setting.id, 'email')}
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  setting.email ? 'bg-green-500' : 'bg-white/20'
                                }`}
                              >
                                {setting.email && <Check className="w-4 h-4 text-white" />}
                              </button>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <button
                                onClick={() => handleNotificationToggle(setting.id, 'push')}
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  setting.push ? 'bg-green-500' : 'bg-white/20'
                                }`}
                              >
                                {setting.push && <Check className="w-4 h-4 text-white" />}
                              </button>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <button
                                onClick={() => handleNotificationToggle(setting.id, 'site')}
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  setting.site ? 'bg-green-500' : 'bg-white/20'
                                }`}
                              >
                                {setting.site && <Check className="w-4 h-4 text-white" />}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>
                  
                  <div className="space-y-6">
                    {privacySettings.map((setting) => (
                      <div key={setting.id} className="bg-white/5 p-4 rounded-lg">
                        <div className="mb-3">
                          <p className="font-medium text-white">{setting.name}</p>
                          <p className="text-sm text-gray-400 mt-1">{setting.description}</p>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handlePrivacyChange(setting.id, 'public')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              setting.value === 'public'
                                ? 'bg-green-600 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            Public
                          </button>
                          <button
                            onClick={() => handlePrivacyChange(setting.id, 'friends')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              setting.value === 'friends'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            Friends Only
                          </button>
                          <button
                            onClick={() => handlePrivacyChange(setting.id, 'private')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              setting.value === 'private'
                                ? 'bg-red-600 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            Private
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Appearance Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Theme</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          onClick={() => setTheme('light')}
                          className={`p-4 rounded-lg border ${
                            theme === 'light'
                              ? 'border-red-500 bg-red-500/10'
                              : 'border-white/20 bg-white/5 hover:bg-white/10'
                          } transition-colors`}
                        >
                          <div className="flex items-center justify-center mb-4">
                            <Sun className="w-8 h-8 text-yellow-400" />
                          </div>
                          <p className="font-medium text-white">Light</p>
                        </button>
                        
                        <button
                          onClick={() => setTheme('dark')}
                          className={`p-4 rounded-lg border ${
                            theme === 'dark'
                              ? 'border-red-500 bg-red-500/10'
                              : 'border-white/20 bg-white/5 hover:bg-white/10'
                          } transition-colors`}
                        >
                          <div className="flex items-center justify-center mb-4">
                            <Moon className="w-8 h-8 text-blue-400" />
                          </div>
                          <p className="font-medium text-white">Dark</p>
                        </button>
                        
                        <button
                          onClick={() => setTheme('system')}
                          className={`p-4 rounded-lg border ${
                            theme === 'system'
                              ? 'border-red-500 bg-red-500/10'
                              : 'border-white/20 bg-white/5 hover:bg-white/10'
                          } transition-colors`}
                        >
                          <div className="flex items-center justify-center mb-4">
                            <Monitor className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="font-medium text-white">System</p>
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Accent Color</h3>
                      
                      <div className="flex flex-wrap gap-3">
                        {['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'].map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full ${color} hover:ring-2 hover:ring-white/50 transition-all`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Language Settings */}
              {activeTab === 'language' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Language Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
                        Interface Language
                      </label>
                      <select
                        id="language"
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="en">English</option>
                        <option value="ja">Japanese</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="contentLanguage" className="block text-sm font-medium text-gray-300 mb-2">
                        Content Language
                      </label>
                      <select
                        id="contentLanguage"
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="en">English</option>
                        <option value="ja">Japanese</option>
                        <option value="both">Both</option>
                      </select>
                      <p className="text-sm text-gray-400 mt-2">
                        This affects titles, descriptions, and other content when available in multiple languages.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Save Button */}
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                    saveStatus === 'saving'
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                
                {saveStatus === 'success' && (
                  <div className="flex items-center text-green-400 space-x-2">
                    <Check className="w-5 h-5" />
                    <span>Settings saved successfully!</span>
                  </div>
                )}
                
                {saveStatus === 'error' && (
                  <div className="flex items-center text-red-400 space-x-2">
                    <X className="w-5 h-5" />
                    <span>Error saving settings. Please try again.</span>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
