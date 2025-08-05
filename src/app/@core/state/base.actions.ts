export namespace Base {
    
    export class SetError {
      static readonly type = '[Base] SetError';
      constructor(public message: string) {}
    }
  
    export class SetSuccess {
      static readonly type = '[Base] SetSuccess';
      constructor(public message: string, public successHeader: string) {}
    }
  
    export class SetSuccessHeader {
      static readonly type = '[Base] SetSuccessHeader';
      constructor(public header: string) {}
    }
  
    export class SetIsLoading {
      static readonly type = '[Base] SetIsLoading';
      constructor(public isLoading: boolean) {}
    }
  }
  