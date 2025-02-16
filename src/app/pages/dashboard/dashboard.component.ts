import {Component, OnInit} from '@angular/core';
import {StatisticsService} from 'src/app/core/services/statistics.service';
import {BehaviorSubject, Observable, Subscription} from "rxjs";

interface CardData {
  title: string;
  value: number;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  cards: CardData[] = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;

  private unsubscribe: Subscription[] = [];
  constructor(private service: StatisticsService) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    console.log('DashboardComponent initialized');
    this.getUserStats();
  }

  getUserStats() {
    this.dataLoadingSubject.next(true);
    const sub = this.service.getUserStats().subscribe(

      (data: any) => {
        this.dataLoadingSubject.next(false);
        console.log('User stats received:', data);
        this.cards.push(
          {
            title: 'Total Users',
            value: data.totalEntrepreneur,
            description: 'Total number of users',
          },
          {
            title: 'Total Projects',
            value: data.totalProjects,
            description: 'Total number of projects',
          },
          {
            title: 'Total Participants',
            value: data.totalParticipants,
            description: 'Total number of categories',
          },
          {
            title: 'Total Investors',
            value: data.totalInvestors,
            description: 'Total number of questions',
          }
        );
        console.log('Cards array after push:', this.cards);
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        console.log('Error fetching user stats:', error);
      }
    );
    this.unsubscribe.push(sub);
  }

}
