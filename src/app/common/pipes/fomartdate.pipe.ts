import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";

@Pipe({
  name: "formatdate"
})
export class FormatDatePipe implements PipeTransform {
  transform(date: string, format: "MMM DD YYYY hh:mm:ssa") {
    return moment(date).format(format);
  }
}
