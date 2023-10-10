import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ConfigService } from '../config/config.service';
import { PrinterStatus } from '../model';
import { PrinterService } from '../services/printer/printer.service';
import { SocketService } from '../services/socket/socket.service';

@Component({
  selector: 'app-printer-status',
  templateUrl: './printer-status.component.html',
  styleUrls: ['./printer-status.component.scss'],
})
export class PrinterStatusComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  public printerStatus: PrinterStatus;
  public fanSpeed: number;
  public status: string;

  public hotendTarget: number;
  public heatbedTarget: number;
  public fanTarget: number;

  public QuickControlView = QuickControlView;
  public view = QuickControlView.NONE;

  public constructor(
    private printerService: PrinterService,
    private configService: ConfigService,
    private socketService: SocketService,
  ) {
    this.hotendTarget = this.configService.getDefaultHotendTemperature();
    this.heatbedTarget = this.configService.getDefaultHeatbedTemperature();
    this.fanTarget = this.configService.getDefaultFanSpeed();
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.socketService.getPrinterStatusSubscribable().subscribe((status: PrinterStatus): void => {
        this.printerStatus = status;
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public showQuickControlHotend(): void {
    this.view = QuickControlView.HOTEND;
    this.showQuickControl();
  }

  public showQuickControlHeatbed(): void {
    this.view = QuickControlView.HEATBED;
    this.showQuickControl();
  }

  public showQuickControlFan(): void {
    this.view = QuickControlView.FAN;
    this.showQuickControl();
  }

  private showQuickControl(): void {
    setTimeout((): void => {
      const controlViewDOM = document.getElementById('quickControl');
      controlViewDOM.style.opacity = '1';
    }, 50);
  }

  public hideQuickControl(): void {
    const controlViewDOM = document.getElementById('quickControl');
    controlViewDOM.style.opacity = '0';
    setTimeout((): void => {
      this.view = QuickControlView.NONE;
    }, 500);
  }

  public stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  public quickControlChangeValue(value: string): void {
    switch (this.view) {
      case QuickControlView.HOTEND:
        this.changeTemperatureHotend(value);
        break;
      case QuickControlView.HEATBED:
        this.changeTemperatureHeatbed(value);
        break;
      case QuickControlView.FAN:
        this.changeSpeedFan(value);
        break;
    }
  }

  public quickControlSetValue(): void {
    switch (this.view) {
      case QuickControlView.HOTEND:
        this.setTemperatureHotend();
        break;
      case QuickControlView.HEATBED:
        this.setTemperatureHeatbed();
        break;
      case QuickControlView.FAN:
        this.setFanSpeed();
        break;
    }
  }

  private changeTemperatureHotend(value: string): void {
    if (value == '-') {
      this.hotendTarget = parseInt(this.hotendTarget.toString().slice(0,-1))
    } else if (value == 't') {
      this.hotendTarget += -1000;
      if (this.hotendTarget < -999) {
        this.hotendTarget = this.configService.getDefaultHotendTemperature();
      } else if (this.hotendTarget < 0) {
        this.hotendTarget = 0;
      }
    } else {
      this.hotendTarget = parseInt(this.hotendTarget.toString() + value)
    }

    if (Number.isNaN(this.hotendTarget)) {
      this.hotendTarget = 0;
    } else if (this.hotendTarget > 999) {
      this.hotendTarget = 999
    }
  }

  private changeTemperatureHeatbed(value: string): void {
    if (value == '-') {
      this.heatbedTarget = parseInt(this.heatbedTarget.toString().slice(0,-1))
    } else if (value == 't') {
      this.heatbedTarget += -1000;
      if (this.heatbedTarget < -999) {
        this.heatbedTarget = this.configService.getDefaultHeatbedTemperature();
      } else if (this.heatbedTarget < 0) {
        this.heatbedTarget = 0;
      }
    } else {
      this.heatbedTarget = parseInt(this.heatbedTarget.toString() + value)
    } 

    if (Number.isNaN(this.heatbedTarget)) {
      this.heatbedTarget = 0;
    } else if (this.heatbedTarget > 999) {
      this.heatbedTarget = 999
    }
  }

  private changeSpeedFan(value: string): void {
    if (value == '-') {
      this.fanTarget = parseInt(this.fanTarget.toString().slice(0,-1))
    } else if (value == 't') {
      this.fanTarget += -1000;
      if (this.fanTarget < -999) {
        this.fanTarget = this.configService.getDefaultFanSpeed();
      } else if (this.fanTarget < 0) {
        this.fanTarget = 0;
      }
    }else {
      this.fanTarget = parseInt(this.fanTarget.toString() + value)
    }

    if (Number.isNaN(this.fanTarget)) {
      this.hotendTarget = 0;
    } else if (this.fanTarget > 100) {
      this.fanTarget = 100
    }
  }

  private setTemperatureHotend(): void {
    this.printerService.setTemperatureHotend(this.hotendTarget);
    this.hideQuickControl();
  }

  private setTemperatureHeatbed(): void {
    this.printerService.setTemperatureBed(this.heatbedTarget);
    this.hideQuickControl();
  }

  private setFanSpeed(): void {
    this.printerService.setFanSpeed(this.fanTarget);
    this.hideQuickControl();
  }
}

enum QuickControlView {
  NONE,
  HOTEND,
  HEATBED,
  FAN,
}
