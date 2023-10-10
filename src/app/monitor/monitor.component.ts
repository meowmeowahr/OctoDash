import { Component } from '@angular/core';
import { Router } from '@angular/router';
import _ from 'lodash-es';

import { ConfigService } from '../config/config.service';
import { PrinterService } from '../services/printer/printer.service';
import { PrinterOctoprintService } from '../services/printer/printer.octoprint.service';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss'],
})
export class MonitorComponent {
  public constructor(
    private notificationService: NotificationService,
    private router: Router,
    private configService: ConfigService,
    private printerService: PrinterService,
  ) {
    console.log(this.printerService.getWebCamUrl(this.loadWebcam))
  }

  public loadWebcam(url) {
    console.log(url)
    document.getElementById("camera_stream").setAttribute("src", url)
  }
}
