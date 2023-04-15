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

import { stageLabels } from '@features/loan-compare/constants';

import { CopyJson } from '@/common/components';
import { maxBirthYear, minBirthYear } from '@/common/constants';
import {
  financialAmountFormatter,
  financialAmountParser,
} from '@/common/utils/financial-amount';
import {
  getDecimalPercentage,
  percentageFormatter,
  percentageParser,
} from '@/common/utils/percentage';

import { InputValues, LoanPackage, Stage } from '../types';
import { Results } from './Results';

export interface InputFormValues {
  soraYear1: number;
  soraYear2: number;
  soraYear3: number;
  soraYear4: number;
  soraYear5: number;
  soraYear6: number;

  // Package 1
  loanPackage1Label: string;
  loanPackage1SpreadYear1: number;
  loanPackage1SpreadYear2: number;
  loanPackage1SpreadYear3: number;
  loanPackage1SpreadYear4: number;
  loanPackage1SpreadYear5: number;
  loanPackage1SpreadYear6: number;

  // Package 2
  loanPackage2Label: string;
  loanPackage2SpreadYear1: number;
  loanPackage2SpreadYear2: number;
  loanPackage2SpreadYear3: number;
  loanPackage2SpreadYear4: number;
  loanPackage2SpreadYear5: number;
  loanPackage2SpreadYear6: number;

  // Months from previous staged. First stage is counted from purchase date.
  stageFoundation: number;
  stageConcrete: number;
  stageWalls: number;
  stageRoof: number;
  stageDoors: number;
  stageRoads: number;
  stageTOP: number;
  stageCSC: number;

  propertyValue: number;
  loanAmount: number;
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

const localStorageKey = 'loanForm';
const sora = 3.612;
const soraIncreasePerYear = 0.1;

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
    soraYear1: sora,
    soraYear2: Math.round((sora + soraIncreasePerYear) * 100) / 100,
    soraYear3: Math.round((sora + soraIncreasePerYear * 2) * 100) / 100,
    soraYear4: Math.round((sora + soraIncreasePerYear * 3) * 100) / 100,
    soraYear5: Math.round((sora + soraIncreasePerYear * 4) * 100) / 100,
    soraYear6: Math.round((sora + soraIncreasePerYear * 5) * 100) / 100,
    loanPackage1Label: 'BANK A',
    loanPackage1SpreadYear1: 0.6,
    loanPackage1SpreadYear2: 0.6,
    loanPackage1SpreadYear3: 0.6,
    loanPackage1SpreadYear4: 0.6,
    loanPackage1SpreadYear5: 0.7,
    loanPackage1SpreadYear6: 0.7,
    loanPackage2Label: 'BANK B',
    loanPackage2SpreadYear1: 0.5,
    loanPackage2SpreadYear2: 0.5,
    loanPackage2SpreadYear3: 0.5,
    loanPackage2SpreadYear4: 0.5,
    loanPackage2SpreadYear5: 1,
    loanPackage2SpreadYear6: 1,

    purchaseYearMonth: dayjs(),
    stageFoundation: 4,
    stageConcrete: 7,
    stageWalls: 3,
    stageRoof: 3,
    stageDoors: 3,
    stageRoads: 3,
    stageTOP: 7,
    stageCSC: 12,

    propertyValue: 2_000_000,
    loanAmount: 1_500_000,
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

const propsForStage: Partial<InputNumberProps<number>> = {
  min: 0,
  max: 18,
  size: 'large',
  style: { width: '100%' },
};

export const LoanForm = () => {
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
    console.log('[LoanForm.handleFormSubmit] values:', values);
    const {
      soraYear1,
      soraYear2,
      soraYear3,
      soraYear4,
      soraYear5,
      soraYear6,
      loanPackage1Label,
      loanPackage1SpreadYear1,
      loanPackage1SpreadYear2,
      loanPackage1SpreadYear3,
      loanPackage1SpreadYear4,
      loanPackage1SpreadYear5,
      loanPackage1SpreadYear6,
      loanPackage2Label,
      loanPackage2SpreadYear1,
      loanPackage2SpreadYear2,
      loanPackage2SpreadYear3,
      loanPackage2SpreadYear4,
      loanPackage2SpreadYear5,
      loanPackage2SpreadYear6,

      propertyValue,
      loanAmount,
      purchaseYearMonth,
      stageFoundation,
      stageConcrete,
      stageWalls,
      stageRoof,
      stageDoors,
      stageRoads,
      stageTOP,
      stageCSC,
      loanYears,
      buyer1BirthYear,
      buyer1GrossSalary,
      buyer2BirthYear,
      buyer2GrossSalary,
    } = values;

    console.log('[LoanForm.handleFormSubmit] Saving to localStorage');
    localStorage.setItem(localStorageKey, JSON.stringify(values));

    const year = purchaseYearMonth.year();
    // Note: month from dayjs is 0-indexed
    const month = purchaseYearMonth.month() + 1;
    // console.log('[LoanForm.handleFormSubmit] year:', year, ' , month:', month);

    let yearCounter = year;
    let monthCounter = month;
    let monthIndex = 0;

    const stageMonths = [
      stageFoundation,
      stageConcrete,
      stageWalls,
      stageRoof,
      stageDoors,
      stageRoads,
      stageTOP,
      stageCSC,
    ];
    // console.log('[LoanForm.handleFormSubmit] stageMonths:', stageMonths);

    const stages: Stage[] = [
      {
        year: yearCounter,
        month: monthCounter,
        monthIndex: 0,
        label: '-',
      },
    ];
    stageMonths.forEach((stage) => {
      monthIndex += stage;
      monthCounter += stage;
      const monthRemainder = monthCounter % 12;
      if (monthRemainder < monthCounter) {
        yearCounter += (monthCounter - monthRemainder) / 12;
        monthCounter = monthRemainder;
      }
      stages.push({
        year: yearCounter,
        month: monthCounter,
        monthIndex,
        label: stageLabels[stages.length - 1],
      });
    });

    console.log('[LoanForm] Stages:', stages);

    const loanPackage1: LoanPackage = {
      label: loanPackage1Label,
      spreadOverYears: [
        loanPackage1SpreadYear1,
        loanPackage1SpreadYear2,
        loanPackage1SpreadYear3,
        loanPackage1SpreadYear4,
        loanPackage1SpreadYear5,
        loanPackage1SpreadYear6,
      ].map(getDecimalPercentage),
    };
    const loanPackage2: LoanPackage = {
      label: loanPackage2Label,
      spreadOverYears: [
        loanPackage2SpreadYear1,
        loanPackage2SpreadYear2,
        loanPackage2SpreadYear3,
        loanPackage2SpreadYear4,
        loanPackage2SpreadYear5,
        loanPackage2SpreadYear6,
      ].map(getDecimalPercentage),
    };

    setInput({
      propertyValue,
      loanAmount,
      soraOverYears: [
        soraYear1,
        soraYear2,
        soraYear3,
        soraYear4,
        soraYear5,
        soraYear6,
      ].map(getDecimalPercentage),
      loanPackages: [loanPackage1, loanPackage2],
      year: purchaseYearMonth.year(),
      month: purchaseYearMonth.month() + 1, // month from dayjs is 0-indexed
      stages,
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
    <div>
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={handleFormSubmit}
        layout="vertical"
        style={{ maxWidth: 1100, marginBottom: 32 }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <h3>Loan package 1</h3>
          </Col>
          <Col span={6}>
            <Form.Item name="loanPackage1Label" label="Loan package name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="loanPackage1SpreadYear1" label="Spread Y1">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item name="loanPackage1SpreadYear2" label="Spread Y2">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="loanPackage1SpreadYear3" label="Spread Y3">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="loanPackage1SpreadYear4" label="Spread Y4">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="loanPackage1SpreadYear5" label="Spread Y5">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="loanPackage1SpreadYear6" label="Spread Y6">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <h3>Loan package 2</h3>
          </Col>
          <Col span={6}>
            <Form.Item name="loanPackage2Label" label="Loan package name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="loanPackage2SpreadYear1" label="Spread Y1">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item name="loanPackage2SpreadYear2" label="Spread Y2">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="loanPackage2SpreadYear3" label="Spread Y3">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="loanPackage2SpreadYear4" label="Spread Y4">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="loanPackage2SpreadYear5" label="Spread Y5">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="loanPackage2SpreadYear6" label="Spread Y6">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <h3>SORA (estimated)</h3>
          </Col>
          <Col span={3}>
            <Form.Item name="soraYear1" label="Sora Year 1">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item name="soraYear2" label="Sora Year 2">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="soraYear3" label="Sora Year 3">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="soraYear4" label="Sora Year 4">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="soraYear5" label="Sora Year 5">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="soraYear6" label="Sora Year 6">
              <InputNumber<number> {...propsForRates} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <h3>Months for each stage</h3>
          </Col>
          <Col span={3}>
            <Form.Item name="stageFoundation" label="Foundation">
              <InputNumber<number> {...propsForStage} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="stageConcrete" label="Concrete">
              <InputNumber<number> {...propsForStage} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="stageWalls" label="Walls">
              <InputNumber<number> {...propsForStage} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="stageRoof" label="Roof">
              <InputNumber<number> {...propsForStage} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="stageDoors" label="Doors">
              <InputNumber<number> {...propsForStage} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="stageRoads" label="Roads">
              <InputNumber<number> {...propsForStage} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="stageTOP" label="TOP">
              <InputNumber<number> {...propsForStage} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="stageCSC" label="CSC">
              <InputNumber<number> {...propsForStage} />
            </Form.Item>
          </Col>
        </Row>

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
            <Form.Item name="loanAmount" label="Loan amount">
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

        <Row style={{ marginTop: 32 }}>
          <Col span={12}>
            <Space>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              {/*<Button type="default" onClick={resetToDefaults}>*/}
              {/*  Reset*/}
              {/*</Button>*/}
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
