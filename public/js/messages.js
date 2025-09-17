// DOM Elements
const conversationList = document.getElementById('conversation-list');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');
const emojiButton = document.getElementById('emoji-btn');
const attachButton = document.getElementById('attach-btn');
const searchInput = document.querySelector('.search-bar input');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const profileMenu = document.getElementById('profile-menu');
const profileDropdown = document.getElementById('profile-dropdown');
const notifyBtn = document.getElementById('notify-btn');

// Sample conversation data
let conversations = [
    {
        id: 1,
        name: 'Riya Sharma',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RS',
        lastMessage: 'Thank you for the session today!',
        time: '10:30 AM',
        unread: 2,
        online: true,
        messages: [
            { text: 'Hello Dr. Sharma, I was wondering if we could reschedule our session?', sent: false, time: '9:45 AM' },
            { text: 'Of course, Riya. What time works for you?', sent: true, time: '10:00 AM' },
            { text: 'Thank you for the session today!', sent: false, time: '10:30 AM' }
        ]
    },
    {
        id: 2,
        name: 'Karan Mehta',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KM',
        lastMessage: 'I\'ve been feeling much better this week',
        time: 'Yesterday',
        unread: 0,
        online: false,
        messages: [
            { text: 'Good morning Dr. Sharma, I\'ve been feeling much better this week', sent: false, time: 'Yesterday' },
            { text: 'That\'s great to hear, Karan! What changes have you noticed?', sent: true, time: 'Yesterday' }
        ]
    },
    {
        id: 3,
        name: 'Neha Verma',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=NV',
        lastMessage: 'Can we discuss the new therapy techniques?',
        time: 'Monday',
        unread: 1,
        online: true,
        messages: [
            { text: 'Hi Dr. Sharma, can we discuss the new therapy techniques in our next session?', sent: false, time: 'Monday' }
        ]
    },
    {
        id: 4,
        name: 'Amit Patel',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AP',
        lastMessage: 'The breathing exercises are helping a lot',
        time: 'Last week',
        unread: 0,
        online: false,
        messages: [
            { text: 'Just wanted to let you know the breathing exercises are helping a lot', sent: false, time: 'Last week' },
            { text: 'I\'m glad to hear that, Amit! Keep up the good work.', sent: true, time: 'Last week' }
        ]
    }
];

let currentConversationId = null;
let isTyping = false;

// Initialize the app
function init() {
    renderConversationList();
    setupEventListeners();
    updateUnreadCount();
}

// Render conversation list
function renderConversationList(filter = '') {
    const filtered = filter 
        ? conversations.filter(conv => 
            conv.name.toLowerCase().includes(filter.toLowerCase()) ||
            conv.lastMessage.toLowerCase().includes(filter.toLowerCase()))
        : conversations;

    conversationList.innerHTML = filtered.map(conv => `
        <div class="conversation ${currentConversationId === conv.id ? 'active' : ''}" 
             data-id="${conv.id}">
            <img src="${conv.avatar}" alt="${conv.name}" class="conversation-avatar">
            <div class="conversation-info">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h4 class="conversation-name">${conv.name}</h4>
                    <span class="conversation-time">${conv.time}</span>
                </div>
                <p class="conversation-preview">${conv.lastMessage}</p>
            </div>
            ${conv.unread > 0 ? `<span class="conversation-unread">${conv.unread}</span>` : ''}
        </div>
    `).join('');
}

// Render messages for a conversation
function renderMessages(conversationId) {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    currentConversationId = conversationId;
    messageInput.disabled = false;
    sendButton.disabled = false;

    // Update conversation list UI
    renderConversationList(searchInput.value);

    // Update chat header
    const chatHeader = document.querySelector('.chat-partner');
    chatHeader.innerHTML = `
        <img src="${conversation.avatar}" alt="${conversation.name}" class="chat-avatar">
        <div>
            <h3>${conversation.name}</h3>
            <span class="status ${conversation.online ? 'online' : 'offline'}">
                ${conversation.online ? 'Online' : 'Offline'}
            </span>
        </div>
    `;

    // Render messages
    messageContainer.innerHTML = conversation.messages.map(msg => `
        <div class="message ${msg.sent ? 'sent' : 'received'}">
            <div class="message-text">${msg.text}</div>
            <div class="message-time">${msg.time} ${msg.sent ? '✓✓' : ''}</div>
        </div>
    `).join('');

    // Clear unread count
    if (conversation.unread > 0) {
        conversation.unread = 0;
        updateUnreadCount();
    }

    // Scroll to bottom
    scrollToBottom();
}

// Send a new message
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !currentConversationId) return;

    const conversation = conversations.find(c => c.id === currentConversationId);
    if (!conversation) return;

    // Create new message
    const newMessage = {
        text,
        sent: true,
        time: formatTime(new Date())
    };

    // Add to messages
    conversation.messages.push(newMessage);
    
    // Update last message preview
    conversation.lastMessage = text.length > 30 ? text.substring(0, 27) + '...' : text;
    conversation.time = 'Just now';
    
    // Re-render
    renderMessages(currentConversationId);
    messageInput.value = '';
    
    // Simulate reply after delay
    simulateReply(conversation);
}

// Simulate a reply from the other person
function simulateReply(conversation) {
    if (isTyping) return;
    
    isTyping = true;
    
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    messageContainer.appendChild(typingIndicator);
    scrollToBottom();
    
    // Simulate typing delay (2-5 seconds)
    const delay = 2000 + Math.random() * 3000;
    
    setTimeout(() => {
        isTyping = false;
        typingIndicator.remove();
        
        // Add auto-reply
        const replies = [
            "I'll get back to you soon.",
            "Thanks for letting me know.",
            "I understand how you feel.",
            "Let's discuss this in our next session.",
            "That's an interesting point.",
            "I appreciate you sharing that.",
            "How has that been working for you?",
            "I'm here to support you."
        ];
        
        const replyText = replies[Math.floor(Math.random() * replies.length)];
        const newMessage = {
            text: replyText,
            sent: false,
            time: formatTime(new Date())
        };
        
        // Add to messages
        conversation.messages.push(newMessage);
        conversation.lastMessage = replyText.length > 30 ? 
            replyText.substring(0, 27) + '...' : replyText;
        conversation.time = 'Just now';
        
        // Re-render
        renderConversationList(searchInput.value);
        renderMessages(currentConversationId);
    }, delay);
}

// Scroll to bottom of messages
function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Format time as HH:MM AM/PM
function formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
}

// Update unread count in the header
function updateUnreadCount() {
    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0);
    const badge = document.getElementById('notify-badge');
    
    if (totalUnread > 0) {
        badge.textContent = totalUnread > 9 ? '9+' : totalUnread;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

// Set up event listeners
function setupEventListeners() {
    // Conversation click
    conversationList.addEventListener('click', (e) => {
        const conversationElement = e.target.closest('.conversation');
        if (conversationElement) {
            const conversationId = parseInt(conversationElement.dataset.id);
            renderMessages(conversationId);
            
            // For mobile: show chat area and hide conversation list
            if (window.innerWidth <= 768) {
                document.querySelector('.conversation-list').classList.remove('active');
                document.querySelector('.chat-area').classList.add('active');
            }
        }
    });
    
    // Send message on button click
    sendButton.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Search conversations
    searchInput.addEventListener('input', (e) => {
        renderConversationList(e.target.value);
    });
    
    // Sidebar toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
    
    // Profile dropdown
    if (profileMenu) {
        profileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = profileDropdown.style.display === 'block';
            profileDropdown.style.display = isVisible ? 'none' : 'block';
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        if (profileDropdown) profileDropdown.style.display = 'none';
    });
    
    // Handle back button for mobile
    window.addEventListener('popstate', () => {
        if (window.innerWidth <= 768) {
            document.querySelector('.conversation-list').classList.add('active');
            document.querySelector('.chat-area').classList.remove('active');
        }
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Handle window resize for responsive design
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        // On desktop, show both panels
        document.querySelector('.conversation-list').style.display = 'flex';
        document.querySelector('.chat-area').style.display = 'flex';
    } else if (currentConversationId) {
        // On mobile, show only chat if a conversation is selected
        document.querySelector('.conversation-list').style.display = 'none';
        document.querySelector('.chat-area').style.display = 'flex';
    } else {
        // On mobile, show only conversation list if no conversation is selected
        document.querySelector('.conversation-list').style.display = 'flex';
        document.querySelector('.chat-area').style.display = 'none';
    }
});
