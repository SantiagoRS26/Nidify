import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PaymentAssignment, PaymentSplit } from '../../../shared/models/payment-split.model';

@Component({
  selector: 'app-split-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './split-modal.component.html',
  styleUrl: './split-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitModalComponent {
  private readonly fb = inject(FormBuilder);

  @Input() members: { userId: string; label: string }[] = [];
  @Input() total = 0;
  @Input() set initialSplit(split: PaymentSplit | null) {
    if (split) {
      this.assignments.clear();
      split.assignments.forEach((a) =>
        this.assignments.push(
          this.fb.group({
            userId: [a.userId],
            label: [a.label ?? ''],
            percentage: [a.percentage ?? null],
            amount: [a.amount ?? null],
          }),
        ),
      );
      this.recalculate();
    }
  }

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<PaymentSplit>();

  readonly form = this.fb.group({
    assignments: this.fb.array([]),
  });

  get assignments(): FormArray {
    return this.form.get('assignments') as FormArray;
  }

  ngOnInit(): void {
    if (!this.assignments.length) {
      this.members.forEach((m) =>
        this.assignments.push(
          this.fb.group({
            userId: [m.userId],
            label: [m.label],
            percentage: [null],
            amount: [null],
          }),
        ),
      );
    }
  }

  onChange(): void {
    this.recalculate();
  }

  private recalculate(): void {
    const total = this.total;
    this.assignments.controls.forEach((ctrl) => {
      const percentage = ctrl.get('percentage')?.value;
      const amount = ctrl.get('amount')?.value;
      let finalAmount = amount;
      let finalPercentage = percentage;
      if (percentage !== null && percentage !== '' && !isNaN(Number(percentage))) {
        finalAmount = (Number(percentage) / 100) * total;
        ctrl.get('amount')?.setValue(finalAmount, { emitEvent: false });
      } else if (amount !== null && amount !== '' && !isNaN(Number(amount))) {
        finalPercentage = total ? (Number(amount) / total) * 100 : 0;
        ctrl.get('percentage')?.setValue(finalPercentage, { emitEvent: false });
      }
    });
  }

  isValidSum(): boolean {
    const sum = this.assignments.controls.reduce(
      (acc, ctrl) => acc + Number(ctrl.get('amount')?.value || 0),
      0,
    );
    return Math.round(sum * 100) === Math.round(this.total * 100);
  }

  apply(): void {
    this.recalculate();
    if (!this.isValidSum()) {
      return;
    }
    const assignments: PaymentAssignment[] = this.assignments.controls.map((ctrl) => ({
      userId: ctrl.get('userId')?.value,
      label: ctrl.get('label')?.value,
      percentage: Number(ctrl.get('percentage')?.value) || 0,
      amount: Number(ctrl.get('amount')?.value) || 0,
      calculatedAmount: Number(ctrl.get('amount')?.value) || 0,
    }));
    this.save.emit({ assignments });
  }
}

