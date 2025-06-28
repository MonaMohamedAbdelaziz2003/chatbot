import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements AfterViewInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  characterId: any;

  constructor(private route: ActivatedRoute, private chatService: ApiService,private http: HttpClient) {}

  characters: any[] = [];
  chats: any[] = [];
  isLoading = false; // Changed from true to false initially
  errorMessage = '';
  selectedChat: any = null;
  selectedCharacter: any;
  messages: any[] = [];
  newMessage: string = '';
  showChatHistory: boolean = false;
  isTyping: boolean = false;

  ngOnInit(): void {
    this.characterId = this.route.snapshot.params['id'];
console.log("open",this.open)
    this.characters = [
      {
        id: "c2241f1a-474d-4aee-940d-2fb6190c6065",
        name: 'Sherlock Holmes',
        image: 'sh.jpg',
        description: 'With a mind sharper than a stiletto, Sherlock Holmes dissects mysteries...'
      },
      {
        id: "b128b37f-f62e-4e69-95fc-f7d10c1e2bf3",
        name: 'Jim Moriarity',
        image: 'jm.jpg',
        description: 'The loyal partner and wise doctor, Watson combines medical intuition...'
      }
    ];

    this.selectedCharacter = this.characters.find(
      char => char.id === this.characterId
    );

    console.log("char", this.selectedCharacter);
    this.loadChats();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  loadChats() {
    this.isLoading = true;
    const characterId = this.characterId;
    if (!characterId) return;

    this.chatService.getChatsByCharacter(characterId).subscribe({
      next: (data) => {
        this.chats = data || [];
        console.log(this.chats[0])
        this.isLoading = false;
        console.log('Loaded chats:', this.chats);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load chats';
        this.isLoading = false;
        console.error('Failed to load chats', err);
      }
    });
  }

  selectChat(chat: any) {
    this.selectedChat = chat;
    this.messages = [];
    this.loadMessages(chat.id);
  }

  loadMessages(chatId: any) {
    this.chatService.getMessagesByChatId(chatId).subscribe({
      next: (data) => {
        console.log('Loaded messages:', data);
        this.messages = data || [];
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => {
        console.log('Error loading messages:', err);
        this.errorMessage = 'Failed to load messages';
      }
    });
  }
  open:boolean=false
  createNewChat(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.open=true;

    this.selectedChat = null;
    this.messages = [];

    setTimeout(() => {
      const newChat = {
        id: null,
        title: 'New Inquiry',
        last_message: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };


      this.selectedChat = newChat;
      this.isLoading = false;

      setTimeout(() => {
        const textarea = document.querySelector('textarea');
        if (textarea) textarea.focus();
      }, 100);
    }, 500);
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const content = this.newMessage.trim();
    const chatId = this.selectedChat?.id;

    const userMessage = {
      id: 'temp_' + Date.now(),
      content: content,
      role: 'user',
      created_at: new Date().toISOString(),
      isTemporary: true
    };

    this.messages.push(userMessage);
    this.newMessage = '';
    this.isTyping = true;

    setTimeout(() => this.scrollToBottom(), 50);

    console.log('Sending:', content, this.characterId, chatId);

    this.chatService.sendMessage(content, this.characterId, chatId).subscribe({
      next: (response) => {
        console.log("Response:", response);

        const chatIdFromResponse = response.data?.[0]?.chat_id;

        if (chatIdFromResponse) {
          // Update selected chat with real ID if it was new
          if (!this.selectedChat.id) {
            this.selectedChat.id = chatIdFromResponse;
            // Add to chats list if it's a new chat
            if (!this.chats.find(c => c.id === chatIdFromResponse)) {
              this.selectedChat.title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
              this.chats.unshift(this.selectedChat);
            }
          }

          // Load fresh messages after a short delay
          setTimeout(() => {
            this.loadMessages(chatIdFromResponse);
            this.isTyping = false;
          }, 1000);
        } else {
          this.isTyping = false;
          this.errorMessage = 'Failed to send message - no chat ID received';
        }
      },
      error: (error) => {
        console.error('Send message error:', error);
        this.errorMessage = 'Message send failed';
        this.isTyping = false;

        // Remove temporary user message on error
        this.messages = this.messages.filter(msg => msg.id !== userMessage.id);
      }
    });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

 deleteMessage(messageId: string) {
  const deletedMessage = this.messages.find(m => m.id === messageId);
  const messageIndex = this.messages.findIndex(m => m.id === messageId);

  if (!deletedMessage || messageIndex === -1) return;

  this.chatService.deleteMessage(messageId).subscribe({
    next: () => {

      this.messages.splice(messageIndex, 1);

    },
    error: () => {
      this.errorMessage = 'Failed to delete message';
    }
  });
}


  deleteChat(chatId: string) {
    this.chatService.deleteChat(chatId).subscribe({
      next: () => {
        this.chats = this.chats.filter(chat => chat.id !== chatId);
        if (this.selectedChat?.id === chatId) {
          this.selectedChat = null;
          this.messages = [];
        }
      },
      error: () => this.errorMessage = 'Failed to delete chat'
    });
  }

  toggleChatHistory(): void {
    this.showChatHistory = !this.showChatHistory;
  }

  scrollToBottom(): void {
    if (this.messagesContainer) {
      setTimeout(() => {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }, 100);
    }
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  trackByChatId(index: number, chat: any): string {
    return chat.id || index.toString();
  }

  simulateError(): void {
    this.errorMessage = 'Failed to start a new inquiry. Please try again.';
    setTimeout(() => this.errorMessage = '', 5000);
  }

  // ////////////////////////?////////////////////////


translatingMessages = new Set<string>();

  async translateMessage(message: any): Promise<void> {
    if (this.translatingMessages.has(message.id)) {
      return; }

    this.translatingMessages.add(message.id);

    try {
      if (message.isTranslated) {
        this.restoreOriginalMessage(message);
      } else {
        await this.translateToArabic(message);
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      this.translatingMessages.delete(message.id);
    }
  }

  private async translateToArabic(message: any): Promise<void> {
    if (!message.originalContent) {
      message.originalContent = message.content;
    }

    try {
      const translatedText = await this.callTranslationAPI(message.content);
      message.content = translatedText;
      message.isTranslated = true;
    } catch (error) {
      throw new Error('فشل في الترجمة');
    }
  }

  private restoreOriginalMessage(message: any): void {
    if (message.originalContent) {
      message.content = message.originalContent;
      message.isTranslated = false;
    }
  }

  private async callTranslationAPI(text: string): Promise<string> {
    const url = 'https://api.mymemory.translated.net/get';
    const params = {
      q: text,
      langpair: 'en|ar'
    };

    try {
      const response: any = await this.http.get(url, { params }).toPromise();

      if (response && response.responseData && response.responseData.translatedText) {
        return response.responseData.translatedText;
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      return await this.fallbackTranslation(text);
    }
  }

  private async fallbackTranslation(text: string): Promise<string> {
    const simpleTranslations: { [key: string]: string } = {
      'hello': 'مرحبا',
      'how are you': 'كيف حالك',
      'thank you': 'شكرا لك',
      'goodbye': 'وداعا',
      'yes': 'نعم',
      'no': 'لا'
    };

    const lowerText = text.toLowerCase().trim();
    return simpleTranslations[lowerText] || `[مترجم] ${text}`;
  }

  isTranslating(messageId: string): boolean {
    return this.translatingMessages.has(messageId);
  }

  getTranslationIcon(message: any): string {
    if (this.isTranslating(message.id)) {
      return '⏳';
    }
    return message.isTranslated ? 'En' : 'Ar';
  }

  getTranslationTooltip(message: any): string {
    if (this.isTranslating(message.id)) {
      return 'translate loading..';
    }
    return message.isTranslated ? 'عرض النص الأصلي' : 'ترجمة للعربي';
  }

  // private showError(message: string): void {
  //   this.errorMessage = message;
  //   setTimeout(() => {
  //     this.errorMessage = '';
  //   }, 3000);
  // }

  isEnglishText(text: string): boolean {
    const englishRegex = /[a-zA-Z]/;
    return englishRegex.test(text);
  }

}
