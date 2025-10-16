import { useNavigate } from 'react-router-dom';
import { Settings, User } from 'lucide-react';
import type { Conversation } from '../App';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  setActiveConversationId: React.Dispatch<React.SetStateAction<string>>;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ conversations, activeConversationId, setActiveConversationId, isOpen = false, onClose }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <>
    {/* Overlay for mobile when sidebar is open */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
    )}
    <aside
      className={`bg-bg-sidebar w-72 max-w-[85vw] flex flex-col flex-shrink-0 z-50 fixed left-0 top-0 bottom-0 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:max-w-none
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      aria-hidden={!isOpen}
    >
      <header className="p-4 flex items-center justify-between border-b border-border-color flex-shrink-0">
        <div className="flex items-center min-w-0">
          <img src="/mlc-logo.png" alt="AI Lawyer Logo" className="w-8 h-8 mr-3 flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="font-bold text-lg text-text-primary truncate">AI Lawyer</h1>
            <p className="text-xs text-text-secondary truncate">Your Personal Legal AI</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-md hover:bg-accent group transition-colors duration-200 flex-shrink-0"
          aria-label="Open settings"
        >
          <Settings className="w-5 h-5 text-text-secondary group-hover:text-text-primary" />
        </button>
      </header>

      <div className="p-3 flex space-x-2 flex-shrink-0">
        <button className="w-full text-sm py-2 px-3 rounded-md bg-accent text-text-primary transition-colors duration-200">Mask</button>
        <button className="w-full text-sm py-2 px-3 rounded-md hover:bg-accent text-text-secondary transition-colors duration-200">Plugin</button>
      </div>
      
  <nav className="flex-1 overflow-y-auto p-3 space-y-1 overscroll-contain">
        {conversations.map((conv) => {
          const isActive = conv.id === activeConversationId;
          return (
            <button
              key={conv.id}
              onClick={() => {
                setActiveConversationId(conv.id);
                if (onClose) onClose();
              }}
              className={`w-full text-left block rounded-lg p-3 transition-colors duration-200 ${isActive ? 'bg-accent-selected' : 'hover:bg-accent'}`}
            >
              <p className="font-semibold text-sm truncate text-text-primary">{conv.title}</p>
              <div className="flex justify-between items-center text-xs text-text-secondary mt-1">
                <span>{conv.messages.length} messages</span>
                <span className="truncate ml-2">{conv.date}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="p-3 border-t border-border-color flex-shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-send-blue flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-text-primary truncate">Legal Professional</p>
            <p className="text-xs text-text-secondary truncate">lawyer@example.com</p>
          </div>
        </div>
      </div>
  </aside>
    </>
  );
}
