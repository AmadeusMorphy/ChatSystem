import { Component } from '@angular/core';
import { ChangeDetectorRef, HostListener, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { Router } from '@angular/router';
import { UserService } from 'src/app/pages/services/user.service';
import { Sidebar } from 'primeng/sidebar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  showHeader: boolean = false;
  username: any;
  items: MenuItem[] | undefined;
  isLoggedIn: boolean = false
  isMenuOpen = false;
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  isScrolled = false;
  isProfileImg: boolean = false;
  currentUserId: any;
  profileImg: any;
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 0; // Change this threshold if needed
  }
  closeCallback(e: Event): void {
    this.sidebarRef.close(e);
  }

  sidebarVisible: boolean = false;


  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private checkRef: ChangeDetectorRef,
    private userService: UserService
  ) {


    //RESPOBSIBLE FOR SHOWING THE HEADER BY CHOOSING THE ROUTS YOU WANT THE HEADER TO EXIST IN//

    this.router.events.subscribe(() => {
      this.showHeader =
        this.router.url === '/home' ||
        this.router.url === '/posts' ||
        this.router.url === '/imgs' ||
        this.router.url === '/chat' ||
        this.router.url === '/add-friend' ||
        this.router.url === '/my-profile' ||
        this.router.url === '/friend-req' ||
        this.router.url === '/friends'

    });
  }


  ngOnInit() {
    this.checkLoginStatus();
    this.checkRef



    this.items = [
      {
        label: 'File',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            items: [
              {
                label: 'Bookmark',
                icon: 'pi pi-fw pi-bookmark'
              },
              {
                label: 'Video',
                icon: 'pi pi-fw pi-video'
              }
            ]
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-trash'
          },
          {
            separator: true
          },
          {
            label: 'Export',
            icon: 'pi pi-fw pi-external-link'
          }
        ]
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {
            label: 'Left',
            icon: 'pi pi-fw pi-align-left'
          },
          {
            label: 'Right',
            icon: 'pi pi-fw pi-align-right'
          },
          {
            label: 'Center',
            icon: 'pi pi-fw pi-align-center'
          },
          {
            label: 'Justify',
            icon: 'pi pi-fw pi-align-justify'
          }
        ]
      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-user-plus'
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-user-minus'
          },
          {
            label: 'Search',
            icon: 'pi pi-fw pi-users',
            items: [
              {
                label: 'Filter',
                icon: 'pi pi-fw pi-filter',
                items: [
                  {
                    label: 'Print',
                    icon: 'pi pi-fw pi-print'
                  }
                ]
              },
              {
                icon: 'pi pi-fw pi-bars',
                label: 'List'
              }
            ]
          }
        ]
      },
      {
        label: 'Events',
        icon: 'pi pi-fw pi-calendar',
        items: [
          {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            items: [
              {
                label: 'Save',
                icon: 'pi pi-fw pi-calendar-plus'
              },
              {
                label: 'Delete',
                icon: 'pi pi-fw pi-calendar-minus'
              }
            ]
          },
          {
            label: 'Archieve',
            icon: 'pi pi-fw pi-calendar-times',
            items: [
              {
                label: 'Remove',
                icon: 'pi pi-fw pi-calendar-minus'
              }
            ]
          }
        ]
      },
      {
        label: 'Quit',
        icon: 'pi pi-fw pi-power-off',
        command: (event: MenuItemCommandEvent) => this.confirm1(event)
      }
    ];

  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;


    if (this.isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }
  checkLoginStatus() {
    this.userService.checkUserLoggedIn();
  }

  confirm1(event: MenuItemCommandEvent) {
    this.confirmationService.confirm({
      target: event.originalEvent as unknown as EventTarget,
      message: 'Are you sure that you want to logout?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.logout()
        this.checkRef
      },
      reject: () => {
      }
    });
  }

  logout() {
    this.userService.logout();
  }
}
