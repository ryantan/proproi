import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  InputNumberProps,
  Modal,
  Row,
  Space,
  Typography,
  message,
} from 'antd';
import { TextAreaRef } from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useMemo, useRef, useState } from 'react';

import { InputValues } from '@features/roi-table/types';

import { CopyJson } from '@/common/components';
import { maxBirthYear, minBirthYear } from '@/common/constants';
import {
  financialAmountFormatter,
  financialAmountParser,
} from '@/common/utils/financial-amount';
import {
  percentageFormatter,
  percentageParser,
} from '@/common/utils/percentage';

import { Results } from './Results';

export interface InputFormValues {
  propertyValue: number;
  annualAppreciation: number;
  maxApprovedLoan: number;
  interestRate: number;
  loanYears: number;
  purchaseYearMonth: dayjs.Dayjs;
  buyer1BirthYear: number;
  buyer1GrossSalary: number;
  buyer2BirthYear: number;
  buyer2GrossSalary: number;
}

export interface InputFormValuesSerialized
  extends Partial<Omit<InputFormValues, 'purchaseYearMonth'>> {
  purchaseYearMonth?: string;
}

const localStorageKey = 'roiForm';

const parseLocalStorageValues = (
  localstorageValue: string | null,
): Partial<InputFormValues> => {
  let fromLocalstorage: Partial<InputFormValues> = {};
  if (localstorageValue) {
    try {
      const fromLocalstorageRaw = JSON.parse(
        localstorageValue,
      ) as InputFormValuesSerialized;
      console.log(
        '[LoanForm.parseLocalStorageValues] fromLocalstorageRaw:',
        fromLocalstorageRaw,
      );

      fromLocalstorage = {
        ...fromLocalstorageRaw,
        purchaseYearMonth: fromLocalstorageRaw.purchaseYearMonth
          ? dayjs(fromLocalstorageRaw.purchaseYearMonth)
          : undefined,
      };
    } catch (error) {
      console.error('Error while reading from localStorage:', error);
    }
  }
  return fromLocalstorage;
};

const getLocalStorageValues = (): Partial<InputFormValues> => {
  const localstorageValue = localStorage.getItem(localStorageKey);
  return parseLocalStorageValues(localstorageValue);
};

const getInitialValues = (): InputFormValues => {
  console.log('[LoanForm.getInitialValues]');
  const defaults = {
    propertyValue: 2_000_000,
    annualAppreciation: 4.0,
    maxApprovedLoan: 1_500_000,
    interestRate: 3.7,
    purchaseYearMonth: dayjs(),
    loanYears: 30,
    buyer1BirthYear: dayjs().year() - 30,
    buyer1GrossSalary: 8000,
    buyer2BirthYear: dayjs().year() - 28,
    buyer2GrossSalary: 5000,
  };

  const fromLocalstorage = getLocalStorageValues();

  return {
    ...defaults,
    ...fromLocalstorage,
  };
};

const propsForRates: Partial<InputNumberProps<number>> = {
  min: 0,
  max: 100,
  formatter: percentageFormatter,
  parser: percentageParser,
  size: 'large',
  style: { width: '100%' },
};

export const RoiForm = () => {
  const [input, setInput] = useState<InputValues>();
  const [form] = Form.useForm<InputFormValues>();

  const [modal, contextHolder] = Modal.useModal();
  const loadValuesInputRef = useRef<TextAreaRef>(null);

  const showSaveModal = () => {
    const values = form.getFieldsValue();
    const jsonValues = JSON.stringify(values);
    console.log('[LoanForm.showSaveModal] jsonValues:', jsonValues);

    modal.success({
      width: 680,
      title: 'Save',
      content: (
        <div>
          <Typography.Paragraph>
            Copy this somewhere, you can load this later.
          </Typography.Paragraph>
          <CopyJson value={jsonValues} />
        </div>
      ),
    });
  };

  const showLoadModal = () => {
    modal.success({
      width: 680,
      title: 'Load',
      content: (
        <div>
          <Typography.Paragraph>
            Load previously saved values.
          </Typography.Paragraph>

          <Input.TextArea ref={loadValuesInputRef} rows={6} />
        </div>
      ),
      onOk: () => {
        const jsonValues =
          loadValuesInputRef.current?.resizableTextArea?.textArea.value;
        console.log('[LoanForm.showLoadModal] jsonValues:', jsonValues);
        if (jsonValues) {
          localStorage.setItem(localStorageKey, jsonValues);
          const parsedValues = parseLocalStorageValues(jsonValues);
          console.log('[LoanForm.showLoadModal] parsedValues:', parsedValues);
          form.setFieldsValue(parsedValues);
        } else {
          message.info('Cannot load empty values!').then();
        }
      },
    });
  };

  const initialValues = useMemo(() => getInitialValues(), []);

  const handleFormSubmit = (values: InputFormValues) => {
    console.log('values:', values);
    const {
      propertyValue,
      annualAppreciation,
      maxApprovedLoan,
      interestRate,
      purchaseYearMonth,
      loanYears,
      buyer1BirthYear,
      buyer1GrossSalary,
      buyer2BirthYear,
      buyer2GrossSalary,
    } = values;

    console.log('[RoiForm.handleFormSubmit] Saving to localStorage');
    localStorage.setItem(localStorageKey, JSON.stringify(values));

    setInput({
      propertyValue,
      annualAppreciation: annualAppreciation / 100,
      maxApprovedLoan,
      interestRate: interestRate / 100,
      year: purchaseYearMonth.year(),
      month: purchaseYearMonth.month() + 1, // month from dayjs is 0-indexed
      loanYears,
      buyer1: {
        birthYear: buyer1BirthYear,
        grossSalary: buyer1GrossSalary,
      },
      buyer2: {
        birthYear: buyer2BirthYear,
        grossSalary: buyer2GrossSalary,
      },
    });
  };

  return (
    <div className={'site-layout-content'} style={{ background: '#FFF' }}>
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={handleFormSubmit}
        layout="vertical"
        style={{ maxWidth: 1100, marginBottom: 32 }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <h3>Purchase info</h3>
          </Col>
          <Col span={5}>
            <Form.Item name="propertyValue" label="Purchase price">
              <InputNumber
                formatter={financialAmountFormatter}
                parser={financialAmountParser}
                size="large"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="purchaseYearMonth" label="Purchase month">
              <DatePicker
                picker="month"
                size="large"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="maxApprovedLoan" label="Max approved loan">
              <InputNumber
                formatter={financialAmountFormatter}
                parser={financialAmountParser}
                size="large"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="loanYears" label="Loan tenure">
              <InputNumber
                min={1}
                max={50}
                size="large"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <h3>Buyers info</h3>
          </Col>
          <Col span={5}>
            <Form.Item
              name="buyer1GrossSalary"
              label="Buyer 1 Salary"
              help="Gross monthly salary before CPF."
            >
              <InputNumber min={0} max={1_000_000} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="buyer1BirthYear" label="Buyer 1 Birth year">
              <InputNumber
                min={minBirthYear}
                max={maxBirthYear}
                size="large"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              name="buyer2GrossSalary"
              label="Buyer 2 Salary"
              help="Gross monthly salary before CPF."
            >
              <InputNumber min={0} max={1_000_000} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="buyer2BirthYear" label="Buyer 2 Birth year">
              <InputNumber
                min={minBirthYear}
                max={maxBirthYear}
                size="large"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <h3>Variables</h3>
          </Col>
          <Col span={5}>
            <Form.Item name="annualAppreciation" label="Annual appreciation">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="interestRate" label="Est. interest rate">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>
        </Row>

        <Row style={{ marginTop: 32 }}>
          <Col span={12}>
            <Space>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Space>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Space>
              <Button type="default" onClick={showSaveModal}>
                Save values
              </Button>
              <Button type="default" onClick={showLoadModal}>
                Load values
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
      {contextHolder}

      {input && <Results input={input} />}
    </div>
  );
};
