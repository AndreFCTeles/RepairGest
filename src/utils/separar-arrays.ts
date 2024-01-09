const separarArray = (value: any): string => {
   if (Array.isArray(value)) { return value.join("; ") + ";"; }
   return value;
};

export default separarArray;