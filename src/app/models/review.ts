export class Review {
   from: string;
   rating: number;
   comment: string;

   constructor(from: string, rating: number, comment: string){
      this.from = from;
      this.rating = rating;
      this.comment = comment;
   }
}