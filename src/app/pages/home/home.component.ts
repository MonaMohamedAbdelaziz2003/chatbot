import { Component, ViewChild, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  currentIndex = 0;
  features = [
    { icon: '🔍', title: 'Deductive Brilliance', description: 'Every detail is scrutinized, every possibility explored.' },
    { icon: '📜', title: 'Victorian Expertise', description: 'Immerse yourself in the era of gaslight and mystery.' },
    { icon: '💡', title: 'Instant Insights', description: 'Swift responses to your most pressing inquiries.' }
  ];
  img: string = 'user.jpg';
  token: string | null = null;
  selectedCharacter: any;
  user: any;
  isDropdownOpen = false;
  showImageModal = false;
  previewImage: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private router: Router, private characterService: ApiService) {}

  ngOnInit() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.getProfiles();
    }
  }

  getProfiles() {
    this.characterService.getProfiles().subscribe({
      next: (data) => {
        this.user = data.data;
      },
      error: (err) => {
        console.error('Failed to load user', err);
      }
    });
  }

  get currentCharacter() {
    return this.characters[this.currentIndex] || {};
  }

  switchCharacter(direction: number) {
    const newIndex = this.currentIndex + direction;
    if (newIndex >= 0 && newIndex < this.characters.length) {
      this.currentIndex = newIndex;
    }
  }

  chat() {
    const token = localStorage.getItem('token');
    if (token) {
      console.log(token);
      this.router.navigate(['/chat']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.removeItem('token');
    window.location.reload();
  }

  login() {
    this.router.navigate(['/login']);
  }

  currentSlide = 0;
  intervalId: any;
  totalSlides = 2;
  characters = [
    { id: "c2241f1a-474d-4aee-940d-2fb6190c6065", name: 'Sherlock Holmes', image: 'sh.jpg', description: 'With a mind sharper than a stiletto, Sherlock Holmes dissects mysteries with unparalleled precision. No crime is too obscure, no clue too trivial for his keen observation. Decades of experience in unraveling the most complex cases.' },
    { id: "b128b37f-f62e-4e69-95fc-f7d10c1e2bf3", name: 'Jim Moriarity', image: 'jm.jpg', description: 'A criminal mastermind with a taste for chaos and precision. As Sherlock Holmes’ greatest adversary, Moriarty orchestrates elaborate schemes to challenge and outwit the detective, pushing the boundaries of logic and morality.' },
  ];
  dots = [0, 1];

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
  }

  previousSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  openChat(characterId: any) {
    const token = localStorage.getItem('token');
    if (token) {
      console.log(token);
      this.router.navigate(['/chat', characterId]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    this.endX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  private startX = 0;
  private endX = 0;

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.startX - this.endX;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.previousSlide();
    } else if (event.key === 'ArrowRight') {
      this.nextSlide();
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-profile-nav')) {
      this.closeDropdown();
    }
  }
// //////////////////// image
  openImageUpload() {
    this.fileInput.nativeElement.click();
  }


    onImageSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
    this.previewImage = e.target?.result as string;


      const body = {
        name:this.user.name,
        image_url: this.previewImage
      };
  this.characterService.updateProfile(body).subscribe({
        next: (response) => {
          console.log('Profile updated', response);
          this.showImageModal = false;
          window.location.reload()
        },
        error: (err) => {
          console.log('Failed to update profile', err);
        }
      });
    };

    reader.readAsDataURL(file);
  }
}

}


