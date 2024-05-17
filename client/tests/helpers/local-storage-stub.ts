import Sinon from 'sinon';
import sinon from 'sinon';

export default function stubLocalStorage(value: {
  locations?: number;
  ship?: number;
}): LocalStorageStub {
  return new LocalStorageStub(value);
}

class LocalStorageStub {
  public readonly getItem: Sinon.SinonStub<string[], string>;
  public readonly setItem: Sinon.SinonStub<string[], void>;

  constructor(value: { locations?: number; ship?: number }) {
    const rawValue = JSON.stringify(value);

    this.getItem = sinon.stub().returns(rawValue);
    this.setItem = sinon.stub();

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: this.getItem,
        setItem: this.setItem,
      },
      writable: true,
    });
  }
}
