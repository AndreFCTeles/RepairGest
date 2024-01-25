

interface FormActionButtonsProps {
   onSubmit: () => void;
   onPrint: () => void;
   onSendEmail: () => void;
}

const FormActionButtons: React.FC<FormActionButtonsProps> = ({ onSubmit, onPrint, onSendEmail }) => {
   return (
      <div>
         <button onClick={onSubmit}>Submit</button>
         <button onClick={onPrint}>Print</button>
         <button onClick={onSendEmail}>Send E-mail</button>
      </div>
   );
};