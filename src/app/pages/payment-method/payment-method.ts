import { Component, signal, ViewChild } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Product, ProductService } from '../../core/models/productos-service-prueba';
import { PaymentMethodRequest } from '../../core/models/paymentmethod-Request';
import { PaymentMethod } from '../../core/services/payment-method/payment-method';

/* interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
} */

@Component({
  selector: 'app-payment-method',
  imports: [
     CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        BreadcrumbModule
  ],
  templateUrl: './payment-method.html',
  styleUrl: './payment-method.scss',
  providers: [MessageService, ProductService, ConfirmationService]
})


export class PaymentMethodComponent {

    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [
        { label: 'Dashboard' },
        { label: 'Métodos de Pago' }
    ];

    @ViewChild('dt') dt!: Table;

    paymentMethods = signal<PaymentMethodRequest[]>([]);
    paymentMethod!: PaymentMethodRequest;

    totalRecords = 0;
    loading = false;
    globalFilter = '';

    dialogVisible = false;
    submitted = false;
    


    constructor(
        private service: PaymentMethod,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    load(event: TableLazyLoadEvent) {

    this.loading = true;

    const page = (event.first ?? 0) / (event.rows ?? 10);
    const size = event.rows ?? 10;
    const sortFieldRaw = event.sortField ?? 'name'
    const sortField = Array.isArray(sortFieldRaw) ? sortFieldRaw[0] : sortFieldRaw;
    const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
    const globalFilter = event.globalFilter as string;

    this.service
      .getAll(page, size, sortField, sortOrder, globalFilter)
      .subscribe({
        next: (res) => {
          this.paymentMethods.set(res.data.content);
          this.totalRecords = res.data.totalElements;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });

    }
    onSearch(event: Event) {
        this.globalFilter = (event.target as HTMLInputElement).value;
        this.dt.reset(); // vuelve a cargar desde backend
    }
    openNew() {
        this.paymentMethod = { name: '', status: true };
        this.submitted = false;
        this.dialogVisible = true;
    }

    save() {
        this.submitted = true;
        if (!this.paymentMethod.name?.trim()) return;

        this.service.create(this.paymentMethod).subscribe(() => {
        this.dialogVisible = false;
        this.dt.reset();
        this.toast('Creado correctamente');
        });
    }
 
    edit(pm: PaymentMethodRequest) {
        this.paymentMethod = { ...pm };
        this.dialogVisible = true;
    }

    update() {
        this.service.update(this.paymentMethod.id!, this.paymentMethod).subscribe(() => {
        this.dialogVisible = false;
        this.dt.reset();
        this.toast('Actualizado correctamente');
        });
    }


    remove(pm: PaymentMethodRequest) {
        this.confirmationService.confirm({
        message: `¿Eliminar "${pm.name}"?`,
        accept: () => {
            this.service.delete(pm.id!).subscribe(() => {
            this.dt.reset();
            this.toast('Eliminado correctamente');
            });
        }
        });
    }

    toast(detail: string) {
        this.messageService.add({
        severity: 'success',
        summary: 'OK',
        detail,
        life: 3000
        });
    }
}


   

