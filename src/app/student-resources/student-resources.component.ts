import {Component} from '@angular/core';

@Component({
    selector: 'app-student-resources',
    templateUrl: './student-resources.component.html',
    styleUrls: ['./student-resources.component.css']
})

export class StudentResourcesComponent {
    libraryItems = [
        {
            title: 'Quantum Physics for Beginners',
            subtitle: 'From Wave Theory to Quantum Computing. Understanding How...',
            blurb: 'Do you want to know the principles that govern everything around you? Have you always been curious about quantum physics and its mysteries but you don\’t know where to begin?',
            iconName: 'book',
        },
        {
            title: 'Tenacious D',
            subtitle: 'The Complete Master Works',
            blurb: 'This highly provocative DVD contains the legendary and epic recital at London\'s Brixton Academy that was by chance recorded on November 3, 2002. Watch as Jack and Kyle slay the mighty dragon and treat the British public to a phenomenal performance that includes the now classic D melodies; Wonderboy, Explosivo, Kyle Quit The Band, Friendship, Kielbasa, Dio, The Cosmic Shame, F#*! Her Gently, Tribute and the ever popular Live Short Films that have been screened during The D\'s shows.',
            iconName: 'videocam',
        },
        {
            title: 'The Complete Idiot\'s Guide to Music Composition',
            subtitle: 'Write the songs that make the whole world sing.',
            blurb: 'A step-by-step guide to writing music, this book shows musicians how to compose simple chord progressions and melodies, and leads them through more advanced compositional techniques and musical forms. Designed for composers of all types of music, it includes instruction on composing stand-alone melodies, using different scales and modes, themes and variations, orchestration, and composing for film, theater, and videogames.',
            iconName: 'book',
        }
    ];

    bookshelfItems = [
        'Multiplication and Division: Times Tables',
        '50 Exercises for Paced, Productive, and Powerful Writing',
        'Anatomy Study Guide',
        'Spanish Phrases',
        'FAA Regulations Manual'
    ]
}
