import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class GradeHandler {

    getLetterGrade(points_possible: number, points_earned: number): string {
        let letter_grade: string = '';
        if (points_possible > 0) { // Avoid div/0 errors, return empty string if no points possible.
            const percentage = (points_earned / points_possible) * 100;

            // As
            if (percentage >= 97) {
                letter_grade = "A+";
            } else if (94 <= percentage && percentage < 97) {
                letter_grade = "A";
            } else if (90 <= percentage && percentage < 94) {
                letter_grade = "A-";
            }
            // Bs
            else if (87 <= percentage && percentage < 90) {
                letter_grade = "B+";
            } else if (84 <= percentage && percentage < 87) {
                letter_grade = "B";
            } else if (80 <= percentage && percentage < 84) {
                letter_grade = "B-";
            }
            // Cs
            else if (77 <= percentage && percentage < 80) {
                letter_grade = "C+";
            } else if (74 <= percentage && percentage < 77) {
                letter_grade = "C";
            } else if (70 <= percentage && percentage < 74) {
                letter_grade = "C-";
            }
            // Ds
            else if (67 <= percentage && percentage < 70) {
                letter_grade = "D+";
            } else if (64 <= percentage && percentage < 67) {
                letter_grade = "D";
            } else if (60 <= percentage && percentage < 64) {
                letter_grade = "D-";
            }
            // F
            else {
                letter_grade = "F";
            }
        }

        return letter_grade;
    }
}
