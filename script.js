// Auth Logic
function handleGoogleLogin() {
    // Simulate API call delay
    const button = document.activeElement;
    const originalContent = button.innerHTML;
    button.innerHTML = `<div class="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>`;
    button.disabled = true;

    setTimeout(() => {
        // Mock User Profile
        const user = {
            name: "Alex Morgan",
            email: "alex.morgan@example.com",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
        };
        localStorage.setItem('nexus_user', JSON.stringify(user));
        window.location.href = 'index.html';
    }, 1500);
}

function handleEmailLogin() {
    // Mock Email Login
    const user = {
        name: "Demo User",
        email: "demo@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo"
    };
    localStorage.setItem('nexus_user', JSON.stringify(user));
    window.location.href = 'index.html';
}

function handleLogout() {
    localStorage.removeItem('nexus_user');
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    // 0. Check Auth State & Update UI
    const user = JSON.parse(localStorage.getItem('nexus_user'));
    const navContainer = document.querySelector('#navbar .hidden.md\\:flex'); // Target desktop nav container

    if (user && navContainer) {
        // Find the "Get Started" button and replace it
        const getStartedBtn = navContainer.querySelector('a[href="signup.html"]');
        if (getStartedBtn) {
            getStartedBtn.remove();

            // Add User Menu
            const userMenuHTML = `
                <div class="relative group">
                    <button class="flex items-center gap-2 focus:outline-none">
                        <img src="${user.avatar}" alt="${user.name}" class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200">
                        <span class="font-medium text-slate-700">${user.name}</span>
                        <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400"></i>
                    </button>
                    <!-- Dropdown -->
                    <div class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden hidden group-hover:block animate-fade-in-up">
                        <div class="px-4 py-3 border-b border-slate-50">
                            <p class="text-xs text-slate-500">Signed in as</p>
                            <p class="text-sm font-bold truncate">${user.email}</p>
                        </div>
                        <a href="#" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Dashboard</a>
                        <a href="#" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Settings</a>
                        <div class="border-t border-slate-50"></div>
                        <button onclick="handleLogout()" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign out</button>
                    </div>
                </div>
            `;
            navContainer.insertAdjacentHTML('beforeend', userMenuHTML);
        }
    } else if (!user && navContainer) {
        // Ensure "Login" link exists if not logged in
        const existingLogin = navContainer.querySelector('a[href="login.html"]');
        if (!existingLogin) {
            // Insert Login before Get Started
            const getStartedBtn = navContainer.querySelector('a[href="signup.html"]');
            if (getStartedBtn) {
                const loginLink = document.createElement('a');
                loginLink.href = 'login.html';
                loginLink.className = 'hover:text-brand-600 transition-colors';
                loginLink.textContent = 'Log in';
                navContainer.insertBefore(loginLink, getStartedBtn);
            }
        }
    }

    // 1. Inject Widget HTML
    // 1. Inject Widget HTML
    const widgetHTML = `
    <div id="crm-widget-container" class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
        <!-- Chat Window -->
        <div id="chat-window" class="hidden w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right transform scale-95 opacity-0">
            <!-- Header -->
            <div class="bg-gradient-to-r from-brand-600 to-indigo-600 p-4 flex items-center justify-between shrink-0">
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <div class="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20">
                            <i data-lucide="bot" class="w-6 h-6"></i>
                        </div>
                        <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-brand-600 rounded-full"></div>
                    </div>
                    <div>
                        <h3 class="font-bold text-white text-sm">Nexus AI Assistant</h3>
                        <p class="text-brand-100 text-xs">Online • Replies instantly</p>
                    </div>
                </div>
                <button id="close-chat" class="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <!-- Messages Area -->
            <div id="messages-container" class="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-4 scroll-smooth">
                <!-- Welcome Message -->
                <div class="flex gap-3">
                    <div class="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <i data-lucide="bot" class="w-4 h-4"></i>
                    </div>
                    <div class="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 max-w-[85%]">
                        Hello! 👋 I'm your Nexus AI assistant. How can I help you boost your sales today?
                    </div>
                </div>
            </div>

            <!-- Input Area -->
            <div class="p-4 bg-white border-t border-slate-100 shrink-0">
                <form id="chat-form" class="relative flex items-center gap-2">
                    <input type="text" id="chat-input" placeholder="Type your message..." 
                        class="w-full bg-slate-50 border border-slate-200 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-400">
                    <button type="submit" class="absolute right-1.5 bg-brand-600 text-white p-2 rounded-full hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <i data-lucide="send" class="w-4 h-4"></i>
                    </button>
                </form>
                <div class="text-center mt-2">
                    <p class="text-[10px] text-slate-400">Powered by Nexus AI Engine</p>
                </div>
            </div>
        </div>

        <!-- Toggle Button -->
        <button id="chat-toggle" class="group relative flex items-center justify-center w-14 h-14 bg-brand-600 text-white rounded-full shadow-lg shadow-brand-600/30 hover:bg-brand-700 hover:scale-105 transition-all duration-300">
            <i data-lucide="message-circle" class="w-7 h-7 absolute transition-all duration-300 group-hover:scale-0 group-hover:opacity-0"></i>
            <i data-lucide="chevron-up" class="w-7 h-7 absolute transition-all duration-300 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"></i>
            
            <!-- Notification Badge -->
            <span class="absolute top-0 right-0 flex h-4 w-4 -mt-1 -mr-1">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold text-white items-center justify-center">1</span>
            </span>
        </button>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // Initialize Icons immediately for the injected content
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Attach Event Listeners
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('messages-container');

    let isOpen = false;

    // Toggle Chat Window
    function toggleChat() {
        isOpen = !isOpen;
        if (isOpen) {
            chatWindow.classList.remove('hidden');
            // Small timeout to allow display:flex to apply before opacity transition
            setTimeout(() => {
                chatWindow.classList.add('open');
            }, 10);
            chatToggle.classList.add('rotate-180');
            chatInput.focus();
        } else {
            chatWindow.classList.remove('open');
            setTimeout(() => {
                chatWindow.classList.add('hidden');
            }, 300);
            chatToggle.classList.remove('rotate-180');
        }
    }

    chatToggle.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);

    // Handle Message Submission
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        // Add User Message
        addMessage(message, 'user');
        chatInput.value = '';

        // Simulate AI Response
        showTypingIndicator();

        // Simulate network delay
        setTimeout(() => {
            removeTypingIndicator();
            const response = generateResponse(message);
            addMessage(response, 'ai');
        }, 1500);
    });

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `flex gap-3 ${sender === 'user' ? 'flex-row-reverse' : ''} animate-fade-in-up`;

        const avatar = sender === 'ai'
            ? `<div class="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center shrink-0 mt-1"><i data-lucide="bot" class="w-4 h-4"></i></div>`
            : `<div class="w-8 h-8 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center shrink-0 mt-1"><i data-lucide="user" class="w-4 h-4"></i></div>`;

        const bubbleClass = sender === 'ai'
            ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
            : 'bg-brand-600 text-white rounded-tr-none shadow-md shadow-brand-600/20';

        div.innerHTML = `
            ${avatar}
            <div class="${bubbleClass} p-3 rounded-2xl shadow-sm text-sm max-w-[85%] leading-relaxed">
                ${text}
            </div>
        `;

        messagesContainer.appendChild(div);
        scrollToBottom();
        if (window.lucide) window.lucide.createIcons();
    }

    function showTypingIndicator() {
        const div = document.createElement('div');
        div.id = 'typing-indicator';
        div.className = 'flex gap-3 animate-fade-in-up';
        div.innerHTML = `
            <div class="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                <i data-lucide="bot" class="w-4 h-4"></i>
            </div>
            <div class="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center h-10">
                <div class="w-1.5 h-1.5 bg-slate-400 rounded-full typing-dot"></div>
                <div class="w-1.5 h-1.5 bg-slate-400 rounded-full typing-dot"></div>
                <div class="w-1.5 h-1.5 bg-slate-400 rounded-full typing-dot"></div>
            </div>
        `;
        messagesContainer.appendChild(div);
        scrollToBottom();
        if (window.lucide) window.lucide.createIcons();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

    // Simple Rule-based AI Logic
    function generateResponse(input) {
        const lowerInput = input.toLowerCase();

        if (lowerInput.includes('price') || lowerInput.includes('cost')) {
            return "Our pricing starts at $29/month for the Starter plan. Check out our Pricing page for more details!";
        }
        if (lowerInput.includes('feature') || lowerInput.includes('do')) {
            return "NexusCRM offers automated lead scoring, email sequences, and AI-driven insights. What specific features are you looking for?";
        }
        if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
            return "Hello there! Ready to supercharge your sales pipeline?";
        }
        if (lowerInput.includes('demo')) {
            return "I can definitely help you schedule a demo! What time works best for you this week?";
        }

        return "That's an interesting question. I'd love to connect you with one of our product specialists to discuss that in detail. Shall I grab their contact info?";
    }

    // File Upload Logic (Contact Page)
    const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
const contactForm = document.getElementById('contact-form');

if (dropZone && fileInput && fileList) {
    let files = [];

    // Drag & Drop Events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropZone.classList.add('drag-active');
    }

    function unhighlight(e) {
        dropZone.classList.remove('drag-active');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const newFiles = dt.files;
        handleFiles(newFiles);
    }

    // Click to upload
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', function () {
        handleFiles(this.files);
    });

    function handleFiles(newFiles) {
        files = [...files, ...newFiles];
        renderFileList();
    }

    function renderFileList() {
        fileList.innerHTML = '';
        files.forEach((file, index) => {
            const div = document.createElement('div');
            div.className = 'file-item flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg';
            div.innerHTML = `
                    <div class="flex items-center gap-3 overflow-hidden">
                        <div class="w-8 h-8 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center shrink-0">
                            <i data-lucide="file" class="w-4 h-4"></i>
                        </div>
                        <div class="min-w-0">
                            <p class="text-sm font-medium text-slate-700 truncate">${file.name}</p>
                            <p class="text-xs text-slate-500">${formatBytes(file.size)}</p>
                        </div>
                    </div>
                    <button type="button" class="text-slate-400 hover:text-red-500 transition-colors p-1" onclick="removeFile(${index})">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                `;
            fileList.appendChild(div);
        });
        if (window.lucide) window.lucide.createIcons();
    }

    window.removeFile = function (index) {
        files.splice(index, 1);
        renderFileList();
    };

    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    // Handle Form Submit
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalContent = btn.innerHTML;

            btn.disabled = true;
            btn.innerHTML = `<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Sending...`;

            setTimeout(() => {
                btn.innerHTML = `<i data-lucide="check" class="w-5 h-5"></i> Message Sent!`;
                btn.classList.remove('bg-brand-600', 'hover:bg-brand-700');
                btn.classList.add('bg-green-500', 'hover:bg-green-600');

                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalContent;
                    btn.classList.add('bg-brand-600', 'hover:bg-brand-700');
                    btn.classList.remove('bg-green-500', 'hover:bg-green-600');
                    contactForm.reset();
                    files = [];
                    renderFileList();
                    if (window.lucide) window.lucide.createIcons();
                }, 3000);
            }, 2000);
        });
    }
}
});
